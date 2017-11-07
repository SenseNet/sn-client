import { Authentication } from 'sn-client-js';
import { BaseRepository } from 'sn-client-js/dist/src/Repository/BaseRepository';
import { GoogleAuthenticationOptions } from './GoogleAuthenticationOptions';

export class GoogleAuthenticationService extends Authentication.JwtService {
    /**
     * 1. Open Login (Google Native) window
     * 2. Await Google profile data
     * 3. Send to Sn endpoint "/sn-oauth/login?provider=google",
     * 4. Parse the response with super.handleAuthenticationResponse(resp)
     */
    public GoogleLogin() {
        // tslint:disable-next-line:no-console
        console.log(this._config.ApiKey);
    }

    /**
     *
     */
    constructor(repo: BaseRepository, private readonly _config: GoogleAuthenticationOptions) {
        super(repo);

    }

}
