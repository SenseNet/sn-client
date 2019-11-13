import { AuthenticationService, ConstantContent, LoginState, ODataParams, Repository } from '@sensenet/client-core'
import { ObservableValue, PathHelper } from '@sensenet/client-utils'
import { User } from '@sensenet/default-content-types'
import Semaphore from 'semaphore-async-await'
import { LoginResponse } from './LoginResponse'
import { OauthProvider } from './OauthProvider'
import { RefreshResponse } from './RefreshResponse'
import { Token } from './Token'
import { TokenPersist } from './TokenPersist'
import { TokenStore } from './TokenStore'

/**
 * This service class manages the JWT authentication, the session and the current login state.
 */
export class JwtService implements AuthenticationService {
  public static setup(repository: Repository, userLoadOptions?: ODataParams<User>): JwtService {
    const s = new JwtService(repository, userLoadOptions)
    s.checkForUpdate()
    return s
  }

  private readonly jwtTokenKeyTemplate: string = 'sn-${siteName}-${tokenName}'

  /**
   * Disposes the service, the state and currentUser observables
   */
  public dispose() {
    this.state.dispose()
    this.currentUser.dispose()
    this.oauthProviders.forEach(provider => provider.dispose())
  }

  /**
   * Set of registered Oauth Providers
   */
  public oauthProviders: Set<OauthProvider> = new Set<OauthProvider>()

  /**
   * Observable value that will update with the current user on user change
   */
  public currentUser: ObservableValue<User> = new ObservableValue<User>(ConstantContent.VISITOR_USER)

  /**
   * This observable indicates the current state of the service
   * @default LoginState.Pending
   */
  public state: ObservableValue<LoginState> = new ObservableValue(LoginState.Pending)

  /**
   * The store for JWT tokens
   */
  private tokenStore: TokenStore = new TokenStore(
    this.repository.configuration.repositoryUrl,
    this.jwtTokenKeyTemplate,
    this.repository.configuration.sessionLifetime === 'session' ? TokenPersist.Session : TokenPersist.Expiration,
  )

  private updateLock = new Semaphore(1)

  /**
   * Executed before each Ajax call. If the access token has been expired, but the refresh token is still valid, it triggers the token refreshing call
   * @returns {Promise<boolean>} Promise with a boolean that indicates if there was a refresh triggered.
   */
  public async checkForUpdate(): Promise<boolean> {
    try {
      await this.updateLock.acquire()
      const now = new Date()
      if (this.tokenStore.AccessToken.IsValid()) {
        if (this.tokenStore.AccessToken.ExpirationTime.getTime() - this.latencyCompensationMs > now.getTime()) {
          this.state.setValue(LoginState.Authenticated)
          return false
        }
      }
      await this.tokenStore.RefreshToken.AwaitNotBeforeTime()
      if (!this.tokenStore.RefreshToken.IsValid()) {
        this.state.setValue(LoginState.Unauthenticated)
        return false
      }
      this.state.setValue(LoginState.Pending)
      return await this.execTokenRefresh()
    } finally {
      await this.updateLock.release()
    }
  }

  /**
   * Executes the token refresh call. Refresh the token in the Token Store and in the Service, updates the HttpService header
   * @returns {Promise<boolean>} An promise that will be completed with true on a succesfull refresh
   */
  private async execTokenRefresh(): Promise<boolean> {
    const response = await this.repository.fetch(
      PathHelper.joinPaths(this.repository.configuration.repositoryUrl, 'sn-token/refresh'),
      {
        method: 'POST',
        headers: {
          'X-Refresh-Data': this.tokenStore.RefreshToken.toString(),
          'X-Authentication-Type': 'Token',
        },
        cache: 'no-cache',
        credentials: 'include',
      },
      false,
    )

    if (response.ok) {
      const json: RefreshResponse = await response.json()
      this.tokenStore.AccessToken = Token.FromHeadAndPayload(json.access)
      this.state.setValue(LoginState.Authenticated)
    } else {
      this.tokenStore.AccessToken = Token.CreateEmpty()
      this.state.setValue(LoginState.Unauthenticated)
    }
    return true
  }

  private async updateUser() {
    const lastUser = this.currentUser.getValue()
    if (this.state.getValue() === LoginState.Unauthenticated) {
      this.currentUser.setValue(ConstantContent.VISITOR_USER)
    } else if (
      this.state.getValue() === LoginState.Authenticated &&
      this.tokenStore.AccessToken.Username !== `${lastUser.Domain}\\${lastUser.LoginName}`
    ) {
      await this.checkForUpdate()
      const response = await this.repository.loadCollection<User>({
        path: 'Root',
        oDataOptions: {
          ...this.userLoadOptions,
          query: 'Id:@@CurrentUser.Id@@',
        },
      })
      this.currentUser.setValue(response.d.results[0])
    }
  }

  /**
   * @param {BaseRepository} _repository the Repository reference for the Authentication. The service will read its configuration and use its HttpProvider
   * @constructs JwtService
   */
  constructor(
    public readonly repository: Repository,
    private readonly userLoadOptions: ODataParams<User> = { select: 'all' },
    private readonly latencyCompensationMs: number = 5000,
  ) {
    this.repository.authentication = this
    this.state.subscribe(() => {
      this.updateUser()
    })
  }

  /**
   * Updates the state based on a specific sensenet Login Response
   * @param {LoginResponse} response
   */
  public handleAuthenticationResponse(response: LoginResponse): boolean {
    this.tokenStore.AccessToken = Token.FromHeadAndPayload(response.access)
    this.tokenStore.RefreshToken = Token.FromHeadAndPayload(response.refresh)
    const isValid = this.tokenStore.AccessToken.IsValid(true)
    return isValid
  }

  /**
   * It is possible to send authentication requests using this action. You provide the username and password and will get the User object as the response if the login operation was
   * successful or HTTP 403 Forbidden message if it wasn’t. If the username does not contain a domain prefix, the configured default domain will be used. After you logged in the user successfully,
   * you will receive a standard ASP.NET auth cookie which will make sure that your subsequent requests will be authorized correctly.
   *
   * The username and password is sent in clear text, always send these kinds of requests through HTTPS.
   * @param username {string} Name of the user.
   * @param password {string} Password of the user.
   * @returns {Promise<boolean>} Returns a Promise that will resolved with a boolean value that indicates if the login was successfull.
   * ```
   * let userLogin = service.Login('alba', 'alba');
   * userLogin.subscribe({
   *  next: response => {
   *      console.log('Login success', response);
   *  },
   *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
   *  complete: () => console.log('done'),
   * });
   * ```
   */
  public async login(username: string, password: string): Promise<boolean> {
    try {
      await this.updateLock.acquire()
      this.state.setValue(LoginState.Pending)
      const authToken = Buffer.from(`${username}:${password}`).toString('base64')
      const response = await this.repository.fetch(
        PathHelper.joinPaths(this.repository.configuration.repositoryUrl, 'sn-token/login'),
        {
          method: 'POST',
          headers: {
            'X-Authentication-Type': 'Token',
            Authorization: `Basic ${authToken}`,
          },
          cache: 'no-cache',
          credentials: 'include',
        },
        false,
      )

      if (response.ok) {
        const json: LoginResponse = await response.json()
        const result = this.handleAuthenticationResponse(json)
        await this.tokenStore.AccessToken.AwaitNotBeforeTime()
        this.state.setValue(result ? LoginState.Authenticated : LoginState.Unauthenticated)
        return result
      } else {
        this.state.setValue(LoginState.Unauthenticated)
        return false
      }
    } finally {
      this.updateLock.release()
    }
  }

  /**
   * Logs out the current user, sets the tokens to 'empty' and sends a Logout request to invalidate all Http only cookies
   * @returns {Promise<boolean>} A promise that will resolved with a boolean value that indicates if the logout succeeded.
   */
  public async logout(): Promise<boolean> {
    try {
      await this.updateLock.acquire()
      this.tokenStore.AccessToken = Token.CreateEmpty()
      this.tokenStore.RefreshToken = Token.CreateEmpty()
      this.state.setValue(LoginState.Unauthenticated)
      await this.repository.fetch(
        PathHelper.joinPaths(this.repository.configuration.repositoryUrl, 'sn-token/logout'),
        {
          method: 'POST',
          cache: 'no-cache',
          credentials: 'include',
        },
        false,
      )
      return true
    } finally {
      await this.updateLock.release()
    }
  }
}
