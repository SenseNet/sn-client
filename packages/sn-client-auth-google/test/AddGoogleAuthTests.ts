import { JwtService } from "@sensenet/authentication-jwt";
import { Repository } from "@sensenet/client-core";
import { expect } from "chai";
import {addGoogleAuth} from "../src/AddGoogleAuth";
import { GoogleOauthProvider } from "../src/GoogleOauthProvider";

// tslint:disable:completed-docs

export const repositoryExtensionTests = describe("RepositoryExtensions", () => {
    it("Can be configured on a Repository", () => {
        const repo = new Repository();
        const jwt = new JwtService(repo);
        const googleOauthProvider = addGoogleAuth(jwt, {clientId: ""});
        expect(googleOauthProvider).to.be.instanceof(GoogleOauthProvider);
    });
});
