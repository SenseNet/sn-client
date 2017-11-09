import { Authentication } from 'sn-client-js';
import { IOauthProvider } from 'sn-client-js/dist/src/Authentication';
import { joinPaths } from 'sn-client-js/dist/src/ODataHelper';
import { BaseRepository } from 'sn-client-js/dist/src/Repository';
import { GoogleAuthenticationOptions } from './index';

export class GoogleAuthenticationService implements IOauthProvider {
    public async Login(token: string): Promise<any> {
        // throw new Error("Method not implemented.");
    }

    private _popup: Window | null;

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
        return new Promise<string>((resolve, reject) => {
            const loginReqUrl = this.GetGoogleLoginUrl();
            this._popup = window.open(loginReqUrl, '_blank', 'toolbar=no,scrollbars=no,resizable=no,top=200,left=300,width=400,height=400', true);
            const timer = setInterval(() => {
                if (this._popup && this._popup.window) {
                    try {
                        /** ToDo: check same domain */
                        if (this._popup.window.location.href !== loginReqUrl) {
                            /** Url Changed. Try get Token info. */
                            const token = this.GetGoogleTokenFromUri(this._popup.window.location);
                            if (token) {
                                // tslint:disable-next-line:no-console
                                resolve(token);
                                this._popup.close();
                                clearInterval(timer);
                            }
                        }
                    } catch {
                        /** */
                    }
                } else {
                    // Popup closed
                    reject();
                    clearInterval(timer);
                }
            }, 50);
        });
    }

    public GetGoogleLoginUrl(): string {
        return `https://accounts.google.com/o/oauth2/v2/auth` +
            `?response_type=token%20id_token` +
            `&redirect_uri=${encodeURIComponent(this._options.RedirectUri)}` +
            `&scope=${encodeURIComponent(this._options.Scope.join(' '))}` +
            `&nonce=${Math.random().toString()}` +
            `&client_id=${encodeURIComponent(this._options.ClientId)}`;
    }

    public GetGoogleTokenFromUri(uri: Location): string | null {
        const tokenSegmentPrefix = 'id_token=';
        const tokenSegment = uri.hash.split('&').find((segment) => segment.indexOf(tokenSegmentPrefix) === 0);
        if (tokenSegment) {
            return tokenSegment.replace(tokenSegmentPrefix, '');
        }
        return null;
    }

    public async GoogleLogin() {
        const token = await this.GetToken();
        const loginResponse = await this._repository.HttpProviderRef.Ajax(Authentication.LoginResponse, {
            url: joinPaths(this._repository.Config.RepositoryUrl, '/sn-oauth/login?provider=google'),
            method: 'POST',
            body: JSON.stringify({ token })
        }).toPromise();

        this._repository.Authentication.HandleAuthenticationResponse(loginResponse);
    }

    /**
     *
     */
    constructor(private readonly _repository: BaseRepository, private readonly _options: GoogleAuthenticationOptions) {
    }

}
