// import { Config } from 'sn-client-js';
import { BaseRepository } from 'sn-client-js/dist/src/Repository/BaseRepository';
import { GoogleAuthenticationOptions } from './GoogleAuthenticationOptions';
import {GoogleAuthenticationService} from './GoogleAuthenticationService';

declare module 'sn-client-js/dist/src/Repository/BaseRepository' {
        // tslint:disable:interface-name
        // tslint:disable:no-shadowed-variable
        interface BaseRepository {
            SetupGoogleAuth: (options: GoogleAuthenticationOptions) => BaseRepository<this['HttpProviderRef'], GoogleAuthenticationService>;
        }
}

BaseRepository.prototype.SetupGoogleAuth = function(options: GoogleAuthenticationOptions) {
    // tslint:disable-next-line:no-string-literal
    this.Authentication = new GoogleAuthenticationService(this, options);
    return this as BaseRepository<any, GoogleAuthenticationService>;
};
