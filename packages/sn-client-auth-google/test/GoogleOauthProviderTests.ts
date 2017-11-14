import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { MockRepository } from 'sn-client-js/dist/test/Mocks';
import { AddGoogleAuth, GoogleAuthenticationOptions, GoogleOauthProvider } from '../src';

@suite('GoogleOauthProvider')
export class GoogleOauthProviderTests {

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
    public 'GetGoogleTokenFromUri() should return the correst id_token'() {
        const repo = new MockRepository();
        const config = new GoogleAuthenticationOptions({
            ClientId: ''
        });
        AddGoogleAuth(repo, config);
        expect(typeof repo.Authentication.GetOauthProvider(GoogleOauthProvider).GetGoogleTokenFromUri).to.be.eq('function');
        const l = { hash: '#id_token=testToken&prop=foo&bar=baz' } as Location;
        const token = repo.Authentication.GetOauthProvider(GoogleOauthProvider).GetGoogleTokenFromUri(l);
        expect(token).to.be.eq('testToken');
    }

    @test
    public 'GetGoogleTokenFromUri() should return null if no id_token provided'() {
        const repo = new MockRepository();
        const config = new GoogleAuthenticationOptions({
            ClientId: ''
        });
        AddGoogleAuth(repo, config);
        expect(typeof repo.Authentication.GetOauthProvider(GoogleOauthProvider).GetGoogleTokenFromUri).to.be.eq('function');
        const l = { hash: '#access_token=testToken&prop=foo&bar=baz' } as Location;
        const token = repo.Authentication.GetOauthProvider(GoogleOauthProvider).GetGoogleTokenFromUri(l);
        expect(token).to.be.eq(null);
    }

}
