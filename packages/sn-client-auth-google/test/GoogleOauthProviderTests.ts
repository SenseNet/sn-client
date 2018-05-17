import { JwtService } from "@sensenet/authentication-jwt";
import { ILoginResponse } from "@sensenet/authentication-jwt/dist/ILoginResponse";
import { Repository } from "@sensenet/client-core";
import { expect } from "chai";
import { JSDOM } from "jsdom";
import { addGoogleAuth } from "../src";
import { GoogleOauthProvider } from "../src/GoogleOauthProvider";

// tslint:disable:no-string-literal
// tslint:disable:completed-docs

export const oauthProviderTests = describe("GoogleOauthProvider", () => {

    let repo: Repository;
    let jwtService: JwtService;
    let oauth: GoogleOauthProvider;

    beforeEach(() => {
        repo = new Repository({}, async () => ({ ok: true, json: async () => ({ access: "", refresh: "" } as ILoginResponse) } as any));
        jwtService = new JwtService(repo);
        repo.authentication = jwtService;
        oauth = addGoogleAuth(jwtService, { clientId: "", redirectUri: "/" });
    });

    afterEach(() => {
        repo.dispose();
    });

    describe("#getGoogleLoginUrl()", () => {
        it("returns a valid Google Login URl", () => {
            const otherOauth = addGoogleAuth(jwtService, {
                clientId: "TestclientId",
                redirectUri: "https://test-redirect-uri",
                scope: ["profile", "email"],
            });
            const expectedUrl = "https://accounts.google.com/o/oauth2/v2/auth?response_type=id_token&redirect_uri=https%3A%2F%2Ftest-redirect-uri&scope=profile%20email&client_id=TestclientId&nonce=";
            expect(otherOauth.getGoogleLoginUrl().indexOf(expectedUrl)).to.be.eq(0);
        });

        it("should return the correct id_token", () => {
            const l = { hash: "#id_token=testToken&prop=foo&bar=baz" } as Location;
            const token = oauth.getGoogleTokenFromUri(l);
            expect(token).to.be.eq("testToken");
        });
    });

    describe("#GetGoogleTokenFromUri()", () => {
        it("should return null if no id_token provided", () => {
            const l = { hash: "#access_token=testToken&prop=foo&bar=baz" } as Location;
            const token = oauth.getGoogleTokenFromUri(l);
            expect(token).to.be.eq(null);
        });
    });

    describe("#login()", () => {
        it("should trigger an Ajax request", async () => {
            let sentArgs: any[] = [];
            repo["fetch"] = async (...args: any[]) => {
                sentArgs = args;
                return {
                    ok: true,
                    json: async () => ({ access: "", refresh: "" } as ILoginResponse),
                } as any;
            };
            await oauth
                .login("testGoogleToken");

            expect(sentArgs[0]).to.be.eq("http://example.origin.com/sn-oauth/login?provider=google");
            expect(sentArgs[1].body).to.be.eq('{"token":"testGoogleToken"}');
        });
        it("should throw on Ajax error", (done) => {
            // ToDo
            repo.fetch = async () => {
                return {
                    ok: false,
                    json: async () => ":(",
                } as any;
            };

            oauth.login("testGoogleToken").then(() => {
                done("Error should be thrown");
            }).catch((err) => {
                done();
            });
        });

        it("should trigger the GetToken() without specified Token", (done: MochaDone) => {
            oauth.getToken = (() => done() as any);
            oauth.login();
        });
    });

    describe("#GetToken()", () => {
        it("should try to retrieve the token silently", (done: MochaDone) => {
            oauth["getTokenSilent"] = (() => done() as any);
            oauth.login();
        });

        it("should try to get the token with prompt when failed to retrieve it silently", (done: MochaDone) => {
            oauth["getTokenSilent"] = () => { throw Error(")"); };
            oauth["getTokenFromPrompt"] = (() => done() as any);
            oauth.login();
        });
    });
    describe("#getTokenSilent()", () => {
        it("should throw if an iframe is already created", (done: MochaDone) => {
            oauth["iframe"] = {} as any;
            oauth["getTokenSilent"]("").then((res) => {
                done("Should have fail");
            }).catch((err) => {
                expect(err.message).to.be.eq("Getting token already in progress");
                done();
            });
        });
        it("should fail when unable to get the Token from the URL", (done: MochaDone) => {
            (global as any).window = {
                document: new JSDOM(),
                location: {
                    origin: "/",
                },
            };

            (window.document as any).createElement = (name: string) => {
                expect(name).to.be.eq("iframe");
                return {
                    style: {},
                    setAttribute: (attrName: string, attrValue: string) => {
                        expect(attrName).to.be.eq("sandbox");
                        expect(attrValue).to.be.eq("allow-same-origin");
                    },
                    onload: null,
                };
            };
            (window.document as any).body = { appendChild: (...args: any[]) => { /** */ }, removeChild: (...args: any[]) => { /** */ } };
            oauth["getTokenSilent"](oauth.getGoogleLoginUrl()).then((result) => {
                done("Should have failed");
            }).catch((err) => {
                expect(err.message).to.be.eq("Token not found");
                done();
            });

            (oauth["iframe"] as any).onload({} as any);
        });

        it("should fail when no Token found", (done: MochaDone) => {
            (global as any).window = {
                document: new JSDOM(),
                location: {
                    origin: "",
                },
            };

            (window.document as any).createElement = (name: string) => {
                expect(name).to.be.eq("iframe");
                return {
                    style: {},
                    setAttribute: (attrName: string, attrValue: string) => {
                        expect(attrName).to.be.eq("sandbox");
                        expect(attrValue).to.be.eq("allow-same-origin");
                    },
                    onload: null,
                };
            };
            (window.document as any).body = { appendChild: (...args: any[]) => { /** */ }, removeChild: (...args: any[]) => { /** */ } };
            oauth["getTokenSilent"](oauth.getGoogleLoginUrl()).then((result) => {
                done("Should have failed");
            }).catch((err) => {
                expect(err.message).to.be.eq("Token not found");
                done();
            });

            (oauth["iframe"] as any).onload({} as any);
        });

        it("getTokenSilent() should return token and clean up iframe", (done: MochaDone) => {
            (global as any).window = {
                document: new JSDOM(),
                location: {
                    origin: "/",
                },
            };

            (window.document as any).createElement = (name: string) => {
                expect(name).to.be.eq("iframe");
                return {
                    style: {},
                    setAttribute: (attrName: string, attrValue: string) => {
                        expect(attrName).to.be.eq("sandbox");
                        expect(attrValue).to.be.eq("allow-same-origin");
                    },
                    onload: null,
                };
            };

            let hasIframeRemoved = false;
            (window.document as any).body = { appendChild: (...args: any[]) => { /** */ }, removeChild: (...args: any[]) => { hasIframeRemoved = true; } };
            oauth["getTokenSilent"](oauth.getGoogleLoginUrl()).then((result) => {
                expect(oauth["iframe"]).to.be.eq(undefined);
                expect(hasIframeRemoved).to.be.eq(true);
                done();
            }).catch((err) => done(err));

            (oauth["iframe"] as any).onload({
                srcElement: {
                    contentDocument: {
                        location: {
                            hash: "#id_token=testToken&foo=bar&param2=prop2",
                        },
                    },
                },
            } as any);
        });
    });

    describe("#getTokenFromPrompt()", () => {
        it("should return the valid token object and close popup", (done: MochaDone) => {
            const popupLocationHref = oauth.getGoogleLoginUrl();
            let isPopupClosed = false;

            (global as any).window = {
                open: () => {
                    return {
                        window: {
                            location: {
                                href: popupLocationHref,
                                hash: "#access_token=testIdToken",
                            },
                        },
                        close: () => {
                            isPopupClosed = true;
                        },
                    };
                },
            };

            setTimeout(() => {
                (oauth["popup"] as any).window.location.href = "https://localhost:8080#access_token=invalid";

            }, 100);

            setTimeout(() => {
                (oauth["popup"] as any).window.location.href = "https://localhost:8080#id_token=testIdToken";
                (oauth["popup"] as any).window.location.hash = "#id_token=testIdToken";

            }, 200);
            oauth["getTokenFromPrompt"](popupLocationHref)
                .then((token) => {
                    expect(token).to.be.eq("testIdToken");
                    expect(isPopupClosed).to.be.eq(true);
                    done();
                }).catch((err) => done(err));
        });

        it("should fail when a popup has been closed before getting the token", (done: MochaDone) => {
            const popupLocationHref = oauth.getGoogleLoginUrl();

            (global as any).window = {
                open: () => {
                    return {
                        window: {
                            location: {
                                href: popupLocationHref,
                                hash: "#id_token=testIdToken",
                            },
                        },
                        close: () => {
                            /** */
                        },
                    };
                },
            };

            setTimeout(() => {
                (oauth["popup"] as any) = null;

            }, 250);
            oauth["getTokenFromPrompt"](popupLocationHref)
                .then(() => {
                    done("should have failed");
                }).catch((err) => done());
        },
        );
    });

});
