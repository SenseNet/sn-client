import { expect } from "chai";
import { TokenPersist } from "../src/TokenPersist";
import { TokenStore } from "../src/TokenStore";
import { TokenStoreType } from "../src/TokenStoreType";
import { MockStorage } from "./MockStorage";
import { MockTokenFactory } from "./MockTokenFactory";

// tslint:disable:completed-docs

export const tokenStoreTests = describe("TokenStore", () => {

    let documentInstance: Document;
    let inMemory: TokenStore;
    let sessionCookie: TokenStore;
    let expirationCookie: TokenStore;
    let sessionStorage: TokenStore;
    let localStorage: TokenStore;

    beforeEach(() => {
        documentInstance = {cookie: ""} as Document;
    });

    describe("Storage initialization", () => {
        it("can be constructed with an InMemoryStore", () => {
            inMemory = new TokenStore("https://my_token_store", "token_store_key_template", TokenPersist.Session);
            expect(inMemory).to.be.instanceof(TokenStore);
            expect(inMemory.tokenStoreType).to.be.eq(TokenStoreType.InMemory);
        });

        it("can be constructed with an InMemoryStore if document doesn't support cookies", () => {
            const store = new TokenStore("https://my_token_store", "token_store_key_template", TokenPersist.Session, {} as any);
            expect(store).to.be.instanceof(TokenStore);
            expect(store.tokenStoreType).to.be.eq(TokenStoreType.InMemory);
        });

        it("should use cookies if document is available", () => {
            sessionCookie = new TokenStore("https://my_token_store", "token_store_key_template", TokenPersist.Session, documentInstance);
            expect(sessionCookie).to.be.instanceof(TokenStore);
            expect(sessionCookie.tokenStoreType).to.be.eq(TokenStoreType.SessionCookie);
        });

        it("should use cookies with expiration if document is available", () => {
            expirationCookie = new TokenStore("https://my_token_store", "token_store_key_template", TokenPersist.Expiration, documentInstance);
            expect(expirationCookie).to.be.instanceof(TokenStore);
            expect(expirationCookie.tokenStoreType).to.be.eq(TokenStoreType.ExpirationCookie);
        });

        it("should return invalid cookie if the cookie is not set", () => {
            // tslint:disable-next-line:no-string-literal
            const retrievedToken = expirationCookie["getTokenFromCookie"]("invalidCookieKey", {cookie: "my-cookie-value"} as any);
            expect(retrievedToken.IsValid()).to.be.eq(false);
        });

        it("should pick up global document if declared", () => {
            (global as any).document = {cookie: ""};
            const store = new TokenStore("https://my_token_store", "token_store_key_template", TokenPersist.Session);
            expect(store).to.be.instanceof(TokenStore);
            expect(store.tokenStoreType).to.be.eq(TokenStoreType.SessionCookie);
        });

        it("should pick up global localStorage and sessionStorage if declared", () => {
            (global as any).localStorage = new MockStorage();
            (global as any).sessionStorage = new MockStorage();
            sessionStorage = new TokenStore("https://my_token_store", "token_store_key_template", TokenPersist.Session);
            expect(sessionStorage).to.be.instanceof(TokenStore);
            expect(sessionStorage.tokenStoreType).to.be.eq(TokenStoreType.SessionStorage);
        });

        it("should work with localStorage", () => {
            (global as any).localStorage = new MockStorage();
            (global as any).sessionStorage = new MockStorage();
            localStorage = new TokenStore("https://my_token_store", "token_store_key_template", TokenPersist.Expiration);
            expect(localStorage).to.be.instanceof(TokenStore);
            expect(localStorage.tokenStoreType).to.be.eq(TokenStoreType.LocalStorage);
        });

        after(() => {
            ((...stores: TokenStore[]) => {
                for (const store of stores) {
                    describe(`Store with type ${store.tokenStoreType}`, () => {

                        it("Should return empty if token is not set", () => {
                            const retrieved = store.GetToken("refresh");
                            expect(retrieved.IsValid()).to.be.eq(false);
                        });

                        it("Should store AccessToken", () => {
                            const token = MockTokenFactory.CreateValid();
                            store.AccessToken = token;
                            const retrieved = store.AccessToken;
                            expect(token.IsValid()).to.be.eq(true);
                            expect(token.toString()).to.be.eq(retrieved.toString());
                        });

                        it("Should store RefreshToken", () => {
                            const token = MockTokenFactory.CreateValid();
                            store.RefreshToken = token;
                            const retrieved = store.RefreshToken;
                            expect(token.IsValid()).to.be.eq(true);
                            expect(token.toString()).to.be.eq(retrieved.toString());
                        });

                    });
                }
            })(inMemory,
                sessionCookie,
                expirationCookie,
                sessionStorage,
                localStorage);

        });
    });
});
