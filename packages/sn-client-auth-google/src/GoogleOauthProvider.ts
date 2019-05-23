import { JwtService, LoginResponse, OauthProvider } from '@sensenet/authentication-jwt'
import { PathHelper, Retrier } from '@sensenet/client-utils'
import { GoogleAuthenticationOptions } from './GoogleAuthenticationOptions'

/**
 * Basic Google OAuth Provider implementation
 * Usage example:
 *
 * ```
 * import { AddGoogleAuth } from 'sn-client-auth-google';
 *
 * AddGoogleAuth(myRepository, {
 *      ClientId: myGoogleClientId
 * });
 *
 * // ...
 * // an example login method:
 * async Login(){
 *  try {
 *      await myRepository.Authentication.GetOauthProvider(GoogleOauthProvider).Login();
 *      console.log('Logged in');
 *  } catch (error) {
 *     console.warn('Error during login', error);
 *  }
 * }
 * ```
 *
 */
export class GoogleOauthProvider implements OauthProvider {
  /**
   * Disposes the OAuth provider
   */
  public dispose() {
    this.iframe = null as any
  }
  /**
   * Logs in the User with Google OAuth. Tries to retrieve the Token, if not provided.
   * @param { string? } token If provided, the sensenet Oauth Login endpoint will be called with this token. Otherwise it will try to get it with GetToken()
   * @returns a Promise that will be resolved after the Login request
   */
  public async login(token?: string): Promise<boolean> {
    if (!token) {
      token = await this.getToken()
    }

    const request = await this.jwtService.repository.fetch(
      PathHelper.joinPaths(this.jwtService.repository.configuration.repositoryUrl, '/sn-oauth/login?provider=google'),
      {
        method: 'POST',
        body: JSON.stringify({ token }),
        credentials: 'include',
      },
    )
    if (request.ok) {
      const loginResponse = await (request.json() as Promise<LoginResponse>)
      return this.jwtService.handleAuthenticationResponse(loginResponse)
    } else {
      throw Error(request.statusText)
    }
  }

  private popup!: Window | null

  /**
   * Gets the Token from a child window.
   * @param {string} loginReqUrl The Login request URL
   * @returns {Promise<string>} A promise that will be resolved with an id_token or rejected in case of any error or interruption
   */
  private async getTokenFromPrompt(loginReqUrl: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      this.popup = this.windowInstance.open(
        loginReqUrl,
        '_blank',
        'toolbar=no,scrollbars=no,resizable=no,top=200,left=300,width=400,height=400',
        true,
      )
      const timer = setInterval(() => {
        if (this.popup && this.popup.window) {
          try {
            if (this.popup.window.location.href !== loginReqUrl) {
              const token = this.getGoogleTokenFromUri(this.popup.window.location)
              if (token) {
                resolve(token)
                this.popup.close()
                clearInterval(timer)
              }
            }
          } catch (error) {
            /** cross-origin */
          }
        } else {
          // Popup closed
          reject(Error('The popup has been closed'))
          clearInterval(timer)
        }
      }, 50)
    })
  }

  private iframe!: HTMLIFrameElement

  /**
   * Tries to retrieve an id_token w/o user interaction
   * @param loginUrl the login Url
   * @returns {Promise<string>} A promise that will be resolved with a token or rejected if cannot get the Token silently.
   */
  private async getTokenSilent(loginUrl: string): Promise<string> {
    if (this.iframe) {
      throw Error('Getting token already in progress')
    }

    const token = await new Promise<string>((resolve, reject) => {
      this.iframe = this.windowInstance.document.createElement('iframe')
      this.iframe.style.display = 'none'
      this.iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts')
      this.iframe.onload = async ev => {
        let location: Location | null = null
        await Retrier.create(async () => {
          try {
            location = ((ev.srcElement as HTMLIFrameElement).contentDocument as Document).location
            return true
          } catch (error) {
            return false
          }
        })
          .setup({
            timeoutMs: 500,
          })
          .run()

        const iframeToken = location && this.getGoogleTokenFromUri(location)
        iframeToken ? resolve(iframeToken) : reject(Error('Token not found'))
        this.windowInstance.document.body.removeChild(this.iframe)
        this.iframe = undefined as any
      }
      this.iframe.src = loginUrl
      this.windowInstance.document.body.appendChild(this.iframe)
    })

    return token
  }

  /**
   * Tries to retrieve a valid Google id_token
   * @returns {Promise<string>} A promise that will be resolved with an id_token, or will be rejected in case of errors or if the dialog closes
   */
  public async getToken(): Promise<string> {
    const loginReqUrl = this.getGoogleLoginUrl()
    try {
      return await this.getTokenSilent(loginReqUrl)
    } catch (error) {
      /** Cannot get token */
    }
    return await this.getTokenFromPrompt(loginReqUrl)
  }

  /**
   * Gets a Google OAuth2 Login window URL based on the provider options
   * @returns {string} the generated Url
   */
  public getGoogleLoginUrl(): string {
    return (
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?response_type=id_token` +
      `&redirect_uri=${encodeURIComponent(this.options.redirectUri)}` +
      `&scope=${encodeURIComponent(this.options.scope.join(' '))}` +
      `&client_id=${encodeURIComponent(this.options.clientId)}` +
      `&nonce=${Math.random().toString()}`
    )
  }

  /**
   * Extracts an id_token from a provided Location
   * @param { Location } uri The Location uri with the hashed id_token to be extracted
   * @returns { string | null } The extracted id_token
   */
  public getGoogleTokenFromUri(uri: Location): string | null {
    const tokenSegmentPrefix = '#id_token='
    const tokenSegment = uri.hash.split('&').find(segment => segment.indexOf(tokenSegmentPrefix) === 0)
    if (tokenSegment) {
      return tokenSegment.replace(tokenSegmentPrefix, '')
    }
    return null
  }

  /**
   *
   * @param {BaseRepository} _repository the Repository instance
   * @param {GoogleAuthenticationOptions} _options Additional options for the Provider
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly options: GoogleAuthenticationOptions,
    private readonly windowInstance: Window,
  ) {}
}
