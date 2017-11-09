import { IAuthenticationService } from 'sn-client-js/dist/src/Authentication';
import { BaseHttpProvider } from 'sn-client-js/dist/src/HttpProviders';
import { BaseRepository } from 'sn-client-js/dist/src/Repository';
import { GoogleAuthenticationOptions } from './GoogleAuthenticationOptions';
import { GoogleAuthenticationService } from './GoogleAuthenticationService';

export const AddGoogleAuth = (repo: BaseRepository<BaseHttpProvider>, options: GoogleAuthenticationOptions) => {
    const googleAuthService = new GoogleAuthenticationService(repo, options);
    (repo.Authentication as IAuthenticationService).SetOauthProvider(googleAuthService);
};
