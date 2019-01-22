import { ObservableValue } from '@sensenet/client-utils'
import { User } from '@sensenet/default-content-types'
import { AuthenticationService, ConstantContent, LoginState, ODataParams, ODataResponse, Repository } from '..'

/**
 * Authentication Service class for using Forms authentication through OData Actions
 */
export class FormsAuthenticationService implements AuthenticationService {
  /**
   * Static Factory Method for attaching the service to a Repository object
   * @param repository The repository instance
   * @param loadUserOptions Additional options for loading User content
   */
  public static Setup(repository: Repository, loadUserOptions?: ODataParams<User>) {
    return new FormsAuthenticationService(repository, loadUserOptions)
  }

  /**
   * This observable indicates the current state of the service
   * @default LoginState.Pending
   */
  public state: ObservableValue<LoginState> = new ObservableValue(LoginState.Unknown)

  /**
   * Observable value that will update with the current user on user change
   */
  public currentUser: ObservableValue<User> = new ObservableValue<User>(ConstantContent.VISITOR_USER)

  constructor(private repository: Repository, private readonly userLoadOptions: ODataParams<User> = { select: 'all' }) {
    this.repository.authentication = this
    this.getCurrentUser()
  }

  /**
   * Disposes the service, the state and currentUser observables
   */
  public async dispose(): Promise<void> {
    /** */
    this.state.dispose()
    this.currentUser.dispose()
  }
  /**
   *
   */
  public async checkForUpdate(): Promise<boolean> {
    return false
  }

  /**
   * Returns the current user value
   */
  public async getCurrentUser() {
    this.state.setValue(LoginState.Pending)
    try {
      const result = await this.repository.loadCollection({
        path: ConstantContent.PORTAL_ROOT.Path,
        oDataOptions: {
          ...this.userLoadOptions,
          query: 'Id:@@CurrentUser.Id@@',
          top: 1,
        },
      })
      if (result.d.__count === 1) {
        if (result.d.results[0].Id !== ConstantContent.VISITOR_USER.Id) {
          this.state.setValue(LoginState.Authenticated)
          this.currentUser.setValue(result.d.results[0])
          return
        }
      }
    } catch (error) {
      /** */
    }
    this.state.setValue(LoginState.Unauthenticated)
    this.currentUser.setValue(ConstantContent.VISITOR_USER)
  }

  /**
   * Logs in with the provided credentials
   * @param username The username for the login
   * @param password The password for the login
   */
  public async login(username: string, password: string): Promise<boolean> {
    try {
      const user = await this.repository.executeAction<{ username: string; password: string }, ODataResponse<User>>({
        body: {
          username,
          password,
        },
        method: 'POST',
        idOrPath: ConstantContent.PORTAL_ROOT.Id,
        name: 'Login',
      })
      this.currentUser.setValue(user.d)
      return user.d.Id !== ConstantContent.VISITOR_USER.Id ? true : false
    } catch (error) {
      return false
    }
  }
  /**
   * Logs out and destroys the current session
   */
  public async logout(): Promise<boolean> {
    await this.repository.executeAction({
      method: 'POST',
      idOrPath: ConstantContent.PORTAL_ROOT.Id,
      name: 'Logout',
      body: {},
    })
    this.currentUser.setValue(ConstantContent.VISITOR_USER)
    return true
  }
}
