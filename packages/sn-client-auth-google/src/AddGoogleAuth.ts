import { IAuthenticationService } from 'sn-client-js/dist/src/Authentication';
import { BaseHttpProvider } from 'sn-client-js/dist/src/HttpProviders';
import { BaseRepository } from 'sn-client-js/dist/src/Repository';
import { GoogleAuthenticationOptions } from './GoogleAuthenticationOptions';
import { GoogleOauthProvider } from './GoogleOauthProvider';

/**
 * Registers an OAuth Provider to the specified Repository instance
 * @param repo The Google Authentication services will be registered into this repository instance
 * @param options Additional options to the Google OAuth Provider
 */
export const AddGoogleAuth = (repo: BaseRepository<BaseHttpProvider, IAuthenticationService>, options: Partial<GoogleAuthenticationOptions> & {ClientId: string}) => {
    const _options = new GoogleAuthenticationOptions(options);
    const googleAuthService = new GoogleOauthProvider(repo, _options);
    repo.Authentication.SetOauthProvider(googleAuthService);
};
