import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { MockRepository } from 'sn-client-js/dist/test/Mocks';
import { AddGoogleAuth, GoogleOauthProvider } from '../src';

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

        const expectedUrl = 'https://accounts.google.com/o/oauth2/v2/auth?response_type=id_token&redirect_uri=https%3A%2F%2Ftest-redirect-uri&scope=profile%20email&client_id=TestClientId&nonce=';

        expect(repo.Authentication.GetOauthProvider(GoogleOauthProvider).GetGoogleLoginUrl().indexOf(expectedUrl)).to.be.eq(0);
    }

    @test
    public 'GetGoogleTokenFromUri() can be called'() {
        // const repo = new MockRepository();
        // const config = new GoogleAuthenticationOptions({
        //     ClientId: ''
        // });
        // AddGoogleAuth(repo, config);
        // expect(typeof repo.Authentication.GetOauthProvider(GoogleOauthProvider).GetGoogleTokenFromUri).to.be.eq('function');
        // repo.Authentication.GetOauthProvider(GoogleOauthProvider).GetGoogleTokenFromUri('' as any);
    }

}
