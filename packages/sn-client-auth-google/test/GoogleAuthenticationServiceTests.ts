import * as Chai from 'chai';
import { suite, test } from 'mocha-typescript';
import { MockRepository } from 'sn-client-js/dist/test/Mocks';
import { AddGoogleAuth, GoogleAuthenticationOptions, GoogleAuthenticationService } from '../src';

const expect = Chai.expect;

@suite('GoogleAuthenticationService')
export class GoogleAuthenticationServiceTests {

    @test
    public 'GetGoogleLoginUrl() returns a valid Google Login URl'() {
        const repo = new MockRepository();
        AddGoogleAuth(repo, {
            ClientId: 'TestClientId',
            RedirectUri: 'https://test-redirect-uri',
            Scope: ['profile', 'email']
        });
        expect(repo.Authentication.GetOauthProvider(GoogleAuthenticationService).GetGoogleLoginUrl())
            .to.be.eq('https://accounts.google.com/o/oauth2/v2/auth?response_type=token&redirect_uri=https%3A%2F%2Ftest-redirect-uri&scope=profile%20email&client_id=TestClientId');
    }

    @test
    public 'GetGoogleTokenFromUri() can be called'() {
        const repo = new MockRepository();
        const config = new GoogleAuthenticationOptions();
        AddGoogleAuth(repo, config);
        expect(typeof repo.Authentication.GetOauthProvider(GoogleAuthenticationService).GetGoogleTokenFromUri).to.be.eq('function');
        repo.Authentication.GetOauthProvider(GoogleAuthenticationService).GetGoogleTokenFromUri('' as any);
    }

}
