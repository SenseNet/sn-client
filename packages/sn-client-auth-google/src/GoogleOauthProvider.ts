import { Authentication } from 'sn-client-js';
import { IOauthProvider } from 'sn-client-js/dist/src/Authentication';
import { joinPaths } from 'sn-client-js/dist/src/ODataHelper';
import { BaseRepository } from 'sn-client-js/dist/src/Repository';
import { GoogleAuthenticationOptions } from './index';

export class GoogleOauthProvider implements IOauthProvider {
    public async Login(token?: string): Promise<any> {
        if (!token) {
            token = await this.GetToken();
        }
        const loginResponse = await this._repository.HttpProviderRef.Ajax(Authentication.LoginResponse, {
            url: joinPaths(this._repository.Config.RepositoryUrl, '/sn-oauth/login?provider=google'),
            method: 'POST',
            body: JSON.stringify({ token })
        }).toPromise();

        this._repository.Authentication.HandleAuthenticationResponse(loginResponse);    }

    private _popup: Window | null;

    private async tryGetTokenFromPrompt(loginReqUrl: string): Promise<string> {
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
                    } catch {
                        /** cross-origin */
                    }
                } else {
                    // Popup closed
                    reject('The popup has been closed');
                    clearInterval(timer);
                }
            }, 50);
        });
    }

    private async tryGetTokenSilent(loginUrl: string): Promise<string> {
        const iframe = window.document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.setAttribute('sandbox', 'allow-same-origin');
        const token = await new Promise<string>((resolve, reject) => {

            iframe.onload = async (ev) => {
                try {
                    const iframeToken = this.GetGoogleTokenFromUri((ev.srcElement as HTMLIFrameElement).contentDocument.location);
                    iframeToken ? resolve(iframeToken) : reject('Token not found');
                    window.document.body.removeChild(iframe);
                } catch (error) {
                    reject(error);
                    window.document.body.removeChild(iframe);
                }
            };
            iframe.src = loginUrl;
            window.document.body.appendChild(iframe);
        });

        return token;
    }

    /**
     *
     * ToDo: check: https://developers.google.com/identity/protocols/OAuth2UserAgent
     * (OAuth 2.0 HTTPS Endpoints. JavaScript Google libs sux.)
     *
     * 1. Open Login (Google Native) window
     * 2. Inspect URL for Google AuthToken (+ timeout + inspect close + error handling)
     * 3. Send token to Sn login endpoint "/sn-oauth/login?provider=google",
     * 4. Parse the response with super.handleAuthenticationResponse(resp) /the authentication flow from there will be the same as for JWT/
     */
    public async GetToken(): Promise<string> {

        const loginReqUrl = this.GetGoogleLoginUrl();
        try {
            return await this.tryGetTokenSilent(loginReqUrl);
        } catch {
            /** Cannot get token */
        }
        return await this.tryGetTokenFromPrompt(loginReqUrl);
    }

    public GetGoogleLoginUrl(): string {
        return `https://accounts.google.com/o/oauth2/v2/auth` +
            `?response_type=id_token` +
            `&redirect_uri=${encodeURIComponent(this._options.RedirectUri)}` +
            `&scope=${encodeURIComponent(this._options.Scope.join(' '))}` +
            `&client_id=${encodeURIComponent(this._options.ClientId)}` +
            `&nonce=${Math.random().toString()}`;
    }

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
     */
    constructor(private readonly _repository: BaseRepository, private readonly _options: GoogleAuthenticationOptions) {
    }

}
