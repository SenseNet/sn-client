import { Repository } from "@sensenet/client-core";
import * as Chai from "chai";
import { JwtService } from "../src/JwtService";
import { LoginResponse } from "../src/LoginResponse";
import { LoginState } from "../src/LoginState";
import { TokenPersist } from "../src/TokenPersist";
import { TokenStore } from "../src/TokenStore";
import { MockStorage } from "./MockStorage";
import { MockTokenFactory } from "./MockTokenFactory";

const expect = Chai.expect;
// tslint:disable:completed-docs

export const tokenStoreTests = describe("TokenStore", () => {

    let documentInstance: Document;
    let localStorageRef: Storage;
    let sessionStorageRef: Storage;

    beforeEach(() => {
        documentInstance = {} as Document;
        localStorageRef = new MockStorage();
        sessionStorageRef = new MockStorage();

    });

    it("can be constructed with session persistance", () => {
        const store = new TokenStore("https://my_token_store", "token_store_key_template", TokenPersist.Session);
        expect(store).to.be.instanceof(TokenStore);
    });
});
