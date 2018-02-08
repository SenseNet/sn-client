import { LoginState, Repository } from "@sensenet/client-core";
import { expect } from "chai";
import { JwtService } from "../src";
import { ILoginResponse } from "../src/ILoginResponse";
import { IRefreshResponse } from "../src/IRefreshResponse";
import { MockTokenFactory } from "./MockTokenFactory";

// tslint:disable:completed-docs
// tslint:disable:no-string-literal
export const jwtServiceTests = describe("JwtService", () => {
    let repo: Repository;
    let jwtService: JwtService;
    beforeEach(() => {
        repo = new Repository({}, (async (info: RequestInfo, init?: RequestInit) => ({} as any)));
        jwtService = new JwtService(repo);
        repo.authentication = jwtService;
    });

    it("can be constructed", () => {
        expect(jwtService).to.be.instanceof(JwtService);
    });

    it("can be constructed with exporation option", () => {
        repo.configuration.sessionLifetime = "expiration";
        const jwtService2 = new JwtService(repo);
        expect(jwtService2).to.be.instanceof(JwtService);
    });

    it("can be disposed with oauth providers", (done: MochaDone) => {
        jwtService.oauthProviders.add({
            login: null as any,
            getToken: null as any,
            dispose: () => {
                done();
            },
        });
        jwtService.dispose();
    });

    describe("#checkForUpdate()", () => {
        it("should return false if not token is set", async () => {
            const hasRefreshed = await jwtService.checkForUpdate();
            expect(hasRefreshed).to.be.eq(false);
        });

        it("should return false if AccessToken is valid", async () => {
            jwtService["tokenStore"].AccessToken = MockTokenFactory.CreateValid();
            const hasRefreshed = await jwtService.checkForUpdate();
            expect(hasRefreshed).to.be.eq(false);
        });

        it("should return true and make a request if AccessToken is invalid but RefreshToken is valid", async () => {
            jwtService["tokenStore"].RefreshToken = MockTokenFactory.CreateValid();
            repo["fetchMethod"] = async () => {
                return {
                    ok: true,
                    json: async () => ({
                        access: MockTokenFactory.CreateValid().toString(),
                        refresh: MockTokenFactory.CreateValid().toString(),
                    } as ILoginResponse),
                };
            };
            const hasRefreshed = await jwtService.checkForUpdate();
            expect(hasRefreshed).to.be.eq(true);
        });
    });

    describe("#execTokenRefresh()", () => {
        it("Should set the state to Authenticated in case of success", async () => {
            jwtService["tokenStore"].RefreshToken = MockTokenFactory.CreateValid();
            repo["fetchMethod"] = async () => {
                return {
                    ok: true,
                    json: async () => ({
                        access: MockTokenFactory.CreateValid().toString(),
                        refresh: MockTokenFactory.CreateValid().toString(),
                    } as IRefreshResponse),
                };
            };
            const hasRefreshed = await jwtService["execTokenRefresh"]();
            expect(hasRefreshed).to.be.eq(true);
            expect(jwtService.state.getValue()).to.be.eq(LoginState.Authenticated);
        });

        it("Should set the state to Unauthenticated in case of request failure", async () => {
            jwtService["tokenStore"].RefreshToken = MockTokenFactory.CreateValid();
            repo["fetchMethod"] = async () => {
                return {
                    ok: false,
                    json: async () => ({}),
                };
            };
            const hasRefreshed = await jwtService["execTokenRefresh"]();
            expect(hasRefreshed).to.be.eq(true);
            expect(jwtService.state.getValue()).to.be.eq(LoginState.Unauthenticated);
        });
    });

    describe("#handleAuthenticationResponse()", () => {
        it("should update the tokens", () => {
            const at = MockTokenFactory.CreateValid().toString();
            const rt =  MockTokenFactory.CreateNotValidYet().toString();
            jwtService.handleAuthenticationResponse({
                access: at,
                refresh: rt,
            });
            expect(jwtService["tokenStore"].AccessToken.toString()).to.be.eq(at);
            expect(jwtService["tokenStore"].RefreshToken.toString()).to.be.eq(rt);
        });

        it("should update status to authenticated if AccessToken is valid", () => {
            const at = MockTokenFactory.CreateValid().toString();
            const rt =  MockTokenFactory.CreateNotValidYet().toString();
            const success = jwtService.handleAuthenticationResponse({
                access: at,
                refresh: rt,
            });
            expect(success).to.be.eq(true);
            expect(jwtService.state.getValue()).to.be.eq(LoginState.Authenticated);
        });

        it("should update status to unauthenticated if AccessToken is invalid", () => {
            const at = MockTokenFactory.CreateExpired().toString();
            const rt =  MockTokenFactory.CreateNotValidYet().toString();
            const success = jwtService.handleAuthenticationResponse({
                access: at,
                refresh: rt,
            });
            expect(success).to.be.eq(false);
            expect(jwtService.state.getValue()).to.be.eq(LoginState.Unauthenticated);
        });
    });

    describe("#login()", () => {
        it("should update status to authenticated if response is ok", async () => {
            repo["fetchMethod"] = async () => {
                return {
                    ok: true,
                    json: async () => ({
                        access: MockTokenFactory.CreateValid().toString(),
                        refresh: MockTokenFactory.CreateValid().toString(),
                    } as ILoginResponse),
                };
            };
            const success = await jwtService.login("user", "pass");
            expect(success).to.be.eq(true);
            expect(jwtService.state.getValue()).to.be.eq(LoginState.Authenticated);
        });

        it("should update status to unauthenticated if response is not ok", async () => {
            repo["fetchMethod"] = async () => {
                return {
                    ok: false,
                    json: async () => ({}),
                };
            };
            const success = await jwtService.login("user", "pass");
            expect(success).to.be.eq(false);
            expect(jwtService.state.getValue()).to.be.eq(LoginState.Unauthenticated);
        });
    });

    describe("#logout()", () => {
        it("should invalidate the tokens", async () => {
            jwtService.handleAuthenticationResponse({
                access: MockTokenFactory.CreateValid().toString(),
                refresh: MockTokenFactory.CreateValid().toString(),
            });
            const success = await jwtService.logout();
            expect(success).to.be.eq(true);
            expect(jwtService["tokenStore"].AccessToken.IsValid()).to.be.eq(false);
            expect(jwtService["tokenStore"].RefreshToken.IsValid()).to.be.eq(false);

        });
    });
});
