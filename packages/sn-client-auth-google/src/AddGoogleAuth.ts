import { IAuthenticationService } from 'sn-client-js/dist/src/Authentication';
import { BaseHttpProvider } from 'sn-client-js/dist/src/HttpProviders';
import { BaseRepository } from 'sn-client-js/dist/src/Repository';
import { GoogleAuthenticationOptions } from './GoogleAuthenticationOptions';
import { GoogleOauthProvider } from './GoogleOauthProvider';

/**
 *
 * @param repo The Google Authentication services will be registered into this repository instance
 * @param options
 */
export const AddGoogleAuth = (repo: BaseRepository<BaseHttpProvider>, options: GoogleAuthenticationOptions) => {

    const googleAuthService = new GoogleOauthProvider(repo, options);
    (repo.Authentication as IAuthenticationService).SetOauthProvider(googleAuthService);
};
