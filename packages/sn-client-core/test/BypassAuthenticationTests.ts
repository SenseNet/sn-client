import { expect } from "chai";
import { BypassAuthentication } from "../src";

// tslint:disable:completed-docs

export const bypassAuthTest = describe("BypassAuthentication", () => {
    it("Should be constructed", () => {
        const auth = new BypassAuthentication();
        expect(auth).to.be.instanceof(BypassAuthentication);
    });

    it("Should be disposable", () => {
        const auth = new BypassAuthentication();
        auth.dispose();
    });

    it("should be resolve checkForUpdate() with false", async () => {
        const auth = new BypassAuthentication();
        const updated = await auth.checkForUpdate();
        expect(updated).to.be.eq(false);
    });

    it("login() should throw error", async () => {
        const auth = new BypassAuthentication();
        try {
            await auth.login("", "");
            throw Error("Should have failed");
        } catch {
            /** */
        }
    });

    it("logout() should throw error", async () => {
        const auth = new BypassAuthentication();
        try {
            await auth.logout();
            throw Error("Should have failed");
        } catch {
            /** */
        }    });
});
