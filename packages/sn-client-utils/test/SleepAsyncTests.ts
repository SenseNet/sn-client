import { expect } from "chai";
import { sleepAsync } from "../src";

/**
 * Tests for async sleep
 */
export const sleepAsyncTests = describe("sleepAsync", () => {
    it("Should return a Promise", () => {
        expect(sleepAsync()).to.be.instanceof(Promise);
    });

    it("Should be resolved in time", async () => {
        await sleepAsync(15);
    });
});
