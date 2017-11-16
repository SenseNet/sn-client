import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { LoginState } from 'sn-client-js/dist/src/Authentication';
import { MockRepository, MockTokenFactory } from 'sn-client-js/dist/test/Mocks';
import { AddGoogleAuth, GoogleAuthenticationOptions, GoogleOauthProvider } from '../src';

import { JSDOM } from 'jsdom';
// tslint:disable:no-string-literal

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
        googleProvider['getTokenFromPrompt'] = () => done();
        googleProvider.Login();
    }

    @test
    public 'getTokenSilent() should throw if an iframe is already created'(done: MochaDone) {
        const repo = new MockRepository();
        repo.Authentication.StateSubject.next(LoginState.Unauthenticated);
        const config = new GoogleAuthenticationOptions({
            ClientId: '',
            RedirectUri: 'https://localhost'
        });
        AddGoogleAuth(repo, config);
        const googleProvider = repo.Authentication.GetOauthProvider(GoogleOauthProvider);
        googleProvider['_iframe'] = {} as any;
        googleProvider['getTokenSilent']('').then((res) => {
            done('Should have fail');
        }).catch((err) => {
            expect(err.message).to.be.eq('Getting token already in progress');
            done();
        });

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
        googleProvider['getTokenSilent'](googleProvider.GetGoogleLoginUrl()).then((result) => {
            done('Should have failed');
        }).catch((err) => {
            expect(err.message).to.be.eq('Token not found');
            done();
        });

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
        googleProvider['getTokenSilent'](googleProvider.GetGoogleLoginUrl()).then((result) => {
            done('Should have failed');
        }).catch((err) => {
            expect(err.message).to.be.eq('Token not found');
            done();
        });

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
        googleProvider['getTokenSilent'](googleProvider.GetGoogleLoginUrl()).then((result) => {
            expect(googleProvider['_iframe']).to.be.eq(undefined);
            expect(hasIframeRemoved).to.be.eq(true);
            done();
        }).catch((err) => done(err));

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

    @test public 'getTokenFromPrompt should return the valid token object and close popup'(done: MochaDone) {
        const repo = new MockRepository();
        repo.Authentication.StateSubject.next(LoginState.Unauthenticated);
        const config = new GoogleAuthenticationOptions({
            ClientId: '',
            RedirectUri: 'https://localhost'
        });
        AddGoogleAuth(repo, config);
        const googleProvider = repo.Authentication.GetOauthProvider(GoogleOauthProvider);

        const popupLocationHref = googleProvider.GetGoogleLoginUrl();
        let isPopupClosed = false;

        (global as any).window = {
            open: () => {
                return {
                    window: {
                        location: {
                            href: popupLocationHref,
                            hash: '#access_token=testIdToken'
                        }
                    },
                    close: () => {
                        isPopupClosed = true;
                    }
                };
            }
        };

        setTimeout(() => {
            (googleProvider['_popup'] as any).window.location.href = 'https://localhost:8080#access_token=invalid';

        }, 100);

        setTimeout(() => {
            (googleProvider['_popup'] as any).window.location.href = 'https://localhost:8080#id_token=testIdToken';
            (googleProvider['_popup'] as any).window.location.hash = '#id_token=testIdToken';

        }, 200);
        googleProvider['getTokenFromPrompt'](popupLocationHref)
            .then((token) => {
                expect(token).to.be.eq('testIdToken');
                expect(isPopupClosed).to.be.eq(true);
                done();
            }).catch((err) => done(err));
    }

    @test public 'getTokenFromPrompt should fail when a popup has been closed before getting the token'(done: MochaDone) {
        const repo = new MockRepository();
        repo.Authentication.StateSubject.next(LoginState.Unauthenticated);
        const config = new GoogleAuthenticationOptions({
            ClientId: '',
            RedirectUri: 'https://localhost'
        });
        AddGoogleAuth(repo, config);
        const googleProvider = repo.Authentication.GetOauthProvider(GoogleOauthProvider);

        const popupLocationHref = googleProvider.GetGoogleLoginUrl();

        (global as any).window = {
            open: () => {
                return {
                    window: {
                        location: {
                            href: popupLocationHref,
                            hash: '#id_token=testIdToken'
                        }
                    },
                    close: () => {
                        /** */
                    }
                };
            }
        };

        setTimeout(() => {
            (googleProvider['_popup'] as any) = null;

        }, 250);
        googleProvider['getTokenFromPrompt'](popupLocationHref)
            .then(() => {
                done('should have failed');
            }).catch((err) => done());
    }

}
