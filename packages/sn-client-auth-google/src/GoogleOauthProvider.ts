import { Authentication, Retrier } from 'sn-client-js';
import { IOauthProvider } from 'sn-client-js/dist/src/Authentication';
import { joinPaths } from 'sn-client-js/dist/src/ODataHelper';
import { BaseRepository } from 'sn-client-js/dist/src/Repository';
import { GoogleAuthenticationOptions } from './index';

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
 *      await this.snService.Authentication.GetOauthProvider(GoogleOauthProvider).Login();
 *      console.log('Logged in');
 *  } catch (error) {
 *     console.warn('Error during login', error);
 *  }
 * }
 * ```
 *
 */
export class GoogleOauthProvider implements IOauthProvider {
    /**
     * Logs in the User with Google OAuth. Tries to retrieve the Token, if not provided.
     * @param { string? } token If provided, the sensenet Oauth Login endpoint will be called with this token. Otherwise it will try to get it with GetToken()
     * @returns a Promise that will be resolved after the Login request
     */
    public async Login(token?: string): Promise<boolean> {
        if (!token) {
            token = await this.GetToken();
        }
        const loginResponse = await new Promise<Authentication.LoginResponse>((resolve, reject) => {
            this._repository.HttpProviderRef.Ajax(Authentication.LoginResponse, {
                url: joinPaths(this._repository.Config.RepositoryUrl, '/sn-oauth/login?provider=google'),
                method: 'POST',
                body: JSON.stringify({ token })
            }).subscribe((res) => resolve(res), (err) => reject(err));
        });

        return this._repository.Authentication.HandleAuthenticationResponse(loginResponse);
    }

    private _popup: Window | null;

    /**
     * Gets the Token from a child window.
     * @param {string} loginReqUrl The Login request URL
     * @returns {Promise<string>} A promise that will be resolved with an id_token or rejected in case of any error or interruption
     */
    private async getTokenFromPrompt(loginReqUrl: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            this._popup = window.open(loginReqUrl, '_blank', 'toolbar=no,scrollbars=no,resizable=no,top=200,left=300,width=400,height=400', true);
            const timer = setInterval(() => {
                if (this._popup && this._popup.window) {
                    try {
                        if (this._popup.window.location.href !== loginReqUrl) {
                            const token = this.GetGoogleTokenFromUri(this._popup.window.location);
                            if (token) {
                                resolve(token);
                                this._popup.close();
                                clearInterval(timer);
                            }
                        }
                    } catch (error) {
                        /** cross-origin */
                    }
                } else {
                    // Popup closed
                    reject(Error('The popup has been closed'));
                    clearInterval(timer);
                }
            }, 50);
        });
    }

    private _iframe: HTMLIFrameElement;

    /**
     * Tries to retrieve an id_token w/o user interaction
     * @param loginUrl the login Url
     * @returns {Promise<string>} A promise that will be resolved with a token or rejected if cannot get the Token silently.
     */
    private async getTokenSilent(loginUrl: string): Promise<string> {

        if (this._iframe) {
            throw Error('Getting token already in progress');
        }

        const token = await new Promise<string>((resolve, reject) => {
            this._iframe = window.document.createElement('iframe');
            this._iframe.style.display = 'none';
            this._iframe.setAttribute('sandbox', 'allow-same-origin');

            this._iframe.onload = async (ev) => {
                let location: Location | undefined;
                await Retrier.Create(async () => {
                    try {
                        location = (ev.srcElement as HTMLIFrameElement).contentDocument.location;
                        return true;
                    } catch (error) {
                        return false;
                    }
                }).Setup({
                    TimeoutMs: 500
                }).Run();

                const iframeToken = location && this.GetGoogleTokenFromUri(location);
                iframeToken ? resolve(iframeToken) : reject(Error('Token not found'));
                window.document.body.removeChild(this._iframe);
                this._iframe = undefined as any;
            };
            this._iframe.src = loginUrl;
            window.document.body.appendChild(this._iframe);
        });

        return token;
    }

    /**
     * Tries to retrieve a valid Google id_token
     * @returns {Promise<string>} A promise that will be resolved with an id_token, or will be rejected in case of errors or if the dialog closes
     */
    public async GetToken(): Promise<string> {

        const loginReqUrl = this.GetGoogleLoginUrl();
        try {
            return await this.getTokenSilent(loginReqUrl);
        } catch (error) {
            /** Cannot get token */
        }
        return await this.getTokenFromPrompt(loginReqUrl);
    }

    /**
     * Gets a Google OAuth2 Login window URL based on the provider options
     * @returns {string} the generated Url
     */
    public GetGoogleLoginUrl(): string {
        return `https://accounts.google.com/o/oauth2/v2/auth` +
            `?response_type=id_token` +
            `&redirect_uri=${encodeURIComponent(this._options.RedirectUri)}` +
            `&scope=${encodeURIComponent(this._options.Scope.join(' '))}` +
            `&client_id=${encodeURIComponent(this._options.ClientId)}` +
            `&nonce=${Math.random().toString()}`;
    }

    /**
     * Extracts an id_token from a provided Location
     * @param { Location } uri The Location uri with the hashed id_token to be extracted
     * @returns { string | null } The extracted id_token
     */
    public GetGoogleTokenFromUri(uri: Location): string | null {
        const tokenSegmentPrefix = '#id_token=';
        const tokenSegment = uri.hash.split('&').find((segment) => segment.indexOf(tokenSegmentPrefix) === 0);
        if (tokenSegment) {
            return tokenSegment.replace(tokenSegmentPrefix, '');
        }
        return null;
    }

    /**
     *
     * @param {BaseRepository} _repository the Repository instance
     * @param {GoogleAuthenticationOptions} _options Additional options for the Provider
     */
    constructor(private readonly _repository: BaseRepository, private readonly _options: GoogleAuthenticationOptions) {
    }

}
