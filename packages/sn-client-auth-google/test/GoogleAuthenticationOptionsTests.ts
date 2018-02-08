import { expect } from "chai";
import { GoogleAuthenticationOptions } from "../src/GoogleAuthenticationOptions";

// tslint:disable:completed-docs
export const authOptionsTests = describe("Google Authentication Options", () => {
    it(" can be constructed with valid default parameters", () => {
        const exampleOrigin = "http://example.origin.com";
        const exampleClientId = "exampleAppId";
        (global as any).window = {
            location: {
                origin: exampleOrigin,
            },
        };
        // tslint:disable-next-line:no-unused-expression
        window;
        const options = new GoogleAuthenticationOptions({
            clientId: exampleClientId,
        });
        expect(options).to.be.instanceof(GoogleAuthenticationOptions);
        expect(options.clientId).to.be.eq(exampleClientId);
        expect(options.redirectUri).to.be.eq(exampleOrigin + "/");
        expect(options.scope).to.be.deep.eq(["email", "profile"]);
    });
    it("can be constructed with valid specified parameters", () => {
        const exampleClientId = "ExampleClientId2";
        const exampleRedirectUri = "exampleRedirectUri";
        const exampleScope = ["item1", "item2"];

        const options = new GoogleAuthenticationOptions({
            clientId: exampleClientId,
            redirectUri: exampleRedirectUri,
            scope: exampleScope,
        });

        expect(options).to.be.instanceof(GoogleAuthenticationOptions);
        expect(options.clientId).to.be.eq(exampleClientId);
        expect(options.redirectUri).to.be.eq(exampleRedirectUri);
        expect(options.scope).to.be.deep.eq(exampleScope);

    });
});
