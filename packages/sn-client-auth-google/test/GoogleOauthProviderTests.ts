import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { LoginState } from 'sn-client-js/dist/src/Authentication';
import { MockRepository, MockTokenFactory } from 'sn-client-js/dist/test/Mocks';
import { AddGoogleAuth, GoogleAuthenticationOptions, GoogleOauthProvider } from '../src';

import { JSDOM } from 'jsdom';

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
        const l = { hash: '#access_token=testToken&prop=foo&bar=baz' } as Location;
        const token = repo.Authentication.GetOauthProvider(GoogleOauthProvider).GetGoogleTokenFromUri(l);
        expect(token).to.be.eq(null);
    }

    @test
    public async 'Login(token) should trigger an Ajax request'() {
        const repo = new MockRepository();
        repo.Authentication.StateSubject.next(LoginState.Unauthenticated);
        const config = new GoogleAuthenticationOptions({
            ClientId: ''
        });
        AddGoogleAuth(repo, config);
        repo.HttpProviderRef.AddResponse(MockTokenFactory.CreateValid().toString());
        await repo.Authentication.GetOauthProvider(GoogleOauthProvider)
            .Login('testGoogleToken');

        expect(repo.HttpProviderRef.RequestLog[0].Options.url).to.be.eq('http://example.origin.com/sn-oauth/login?provider=google');
        expect(repo.HttpProviderRef.RequestLog[0].Options.body).to.be.eq('{"token":"testGoogleToken"}');
    }

    @test
    public 'Login(token) should throw on Ajax error'(done) {
        const repo = new MockRepository();
        repo.Authentication.StateSubject.next(LoginState.Unauthenticated);
        const config = new GoogleAuthenticationOptions({
            ClientId: ''
        });
        AddGoogleAuth(repo, config);
        repo.HttpProviderRef.AddError(':(');
        repo.Authentication.GetOauthProvider(GoogleOauthProvider).Login('testGoogleToken').then(() => {
            done('Error should be thrown');
        }).catch((err) => {
            expect(err).to.be.eq(':(');
            done();
        });
    }

    @test
    public 'Login() without specified Token should trigger the GetToken()'(done: MochaDone) {
        const repo = new MockRepository();
        repo.Authentication.StateSubject.next(LoginState.Unauthenticated);
        const config = new GoogleAuthenticationOptions({
            ClientId: ''
        });
        AddGoogleAuth(repo, config);

        const googleProvider = repo.Authentication.GetOauthProvider(GoogleOauthProvider);
        googleProvider.GetToken = () => done();

        googleProvider.Login();
    }

    @test
    public 'GetToken() should try to retrieve the token silently'(done: MochaDone) {
        const repo = new MockRepository();
        repo.Authentication.StateSubject.next(LoginState.Unauthenticated);
        const config = new GoogleAuthenticationOptions({
            ClientId: ''
        });
        AddGoogleAuth(repo, config);

        const googleProvider = repo.Authentication.GetOauthProvider(GoogleOauthProvider);
        // tslint:disable-next-line:no-string-literal
        googleProvider['getTokenSilent'] = () => done();
        googleProvider.Login();
    }

    @test
    public 'GetToken() should try to get the token with prompt when failed to retrieve it silently'(done: MochaDone) {
        const repo = new MockRepository();
        repo.Authentication.StateSubject.next(LoginState.Unauthenticated);
        const config = new GoogleAuthenticationOptions({
            ClientId: ''
        });
        AddGoogleAuth(repo, config);

        const googleProvider = repo.Authentication.GetOauthProvider(GoogleOauthProvider);
        // tslint:disable-next-line:no-string-literal
        googleProvider['getTokenFromPrompt'] = () => done();
        googleProvider.Login();
    }

    @test
    public 'getTokenSilent() should fail when unable to get the Token from the URL'(done: MochaDone) {
        const repo = new MockRepository();
        repo.Authentication.StateSubject.next(LoginState.Unauthenticated);
        const config = new GoogleAuthenticationOptions({
            ClientId: '',
            RedirectUri: 'https://localhost'
        });
        AddGoogleAuth(repo, config);
        (global as any).window = {
            document: new JSDOM()
        };

        (window.document as any).createElement = (name: string) => {
            expect(name).to.be.eq('iframe');
            return {
                style: {},
                setAttribute: (attrName, attrValue) => {
                    expect(attrName).to.be.eq('sandbox');
                    expect(attrValue).to.be.eq('allow-same-origin');
                },
                onload: null
            };
        };
        (window.document as any).body = {appendChild: (...args) => { /** */ }, removeChild: (...args) => { /** */}};
        const googleProvider = repo.Authentication.GetOauthProvider(GoogleOauthProvider);
        // tslint:disable-next-line:no-string-literal
        googleProvider['getTokenSilent'](googleProvider.GetGoogleLoginUrl()).then((result) => {
            done('Should have failed');
        }).catch((err) => {
            expect(err.message).to.be.eq('Token not found');
            done();
        });

        // tslint:disable-next-line:no-string-literal
        googleProvider['_iframe'].onload({} as any);
    }

    @test
    public 'getTokenSilent() should fail when no Token found'(done: MochaDone) {
        const repo = new MockRepository();
        repo.Authentication.StateSubject.next(LoginState.Unauthenticated);
        const config = new GoogleAuthenticationOptions({
            ClientId: '',
            RedirectUri: 'https://localhost'
        });
        AddGoogleAuth(repo, config);
        (global as any).window = {
            document: new JSDOM()
        };

        (window.document as any).createElement = (name: string) => {
            expect(name).to.be.eq('iframe');
            return {
                style: {},
                setAttribute: (attrName, attrValue) => {
                    expect(attrName).to.be.eq('sandbox');
                    expect(attrValue).to.be.eq('allow-same-origin');
                },
                onload: null
            };
        };
        (window.document as any).body = {appendChild: (...args) => { /** */ }, removeChild: (...args) => { /** */}};
        const googleProvider = repo.Authentication.GetOauthProvider(GoogleOauthProvider);
        // tslint:disable-next-line:no-string-literal
        googleProvider['getTokenSilent'](googleProvider.GetGoogleLoginUrl()).then((result) => {
            done('Should have failed');
        }).catch((err) => {
            expect(err.message).to.be.eq('Token not found');
            done();
        });

        // tslint:disable-next-line:no-string-literal
        googleProvider['_iframe'].onload({} as any);
    }

    @test
    public 'getTokenSilent() should return token and clean up iframe'(done: MochaDone) {

        const repo = new MockRepository();
        repo.Authentication.StateSubject.next(LoginState.Unauthenticated);
        const config = new GoogleAuthenticationOptions({
            ClientId: '',
            RedirectUri: 'https://localhost'
        });
        AddGoogleAuth(repo, config);
        (global as any).window = {
            document: new JSDOM()
        };

        (window.document as any).createElement = (name: string) => {
            expect(name).to.be.eq('iframe');
            return {
                style: {},
                setAttribute: (attrName, attrValue) => {
                    expect(attrName).to.be.eq('sandbox');
                    expect(attrValue).to.be.eq('allow-same-origin');
                },
                onload: null
            };
        };

        let hasIframeRemoved = false;
        (window.document as any).body = {appendChild: (...args) => { /** */ }, removeChild: (...args) => {  hasIframeRemoved = true; }};
        const googleProvider = repo.Authentication.GetOauthProvider(GoogleOauthProvider);
        // tslint:disable-next-line:no-string-literal
        googleProvider['getTokenSilent'](googleProvider.GetGoogleLoginUrl()).then((result) => {
            // tslint:disable-next-line:no-string-literal
            expect(googleProvider['_iframe']).to.be.eq(undefined);
            expect(hasIframeRemoved).to.be.eq(true);
            done();
        }).catch((err) => done(err));

        // tslint:disable-next-line:no-string-literal
        googleProvider['_iframe'].onload({
            srcElement: {
                contentDocument: {
                    location: {
                        hash: '#id_token=testToken&foo=bar&param2=prop2'
                    }
                }
            }
        } as any);
    }

}
