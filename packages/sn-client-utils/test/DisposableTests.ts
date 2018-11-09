import { expect } from "chai";
import { using, usingAsync } from "../src";
import { MockDisposable } from "./MockDisposable";

/**
 * Unit tests for disposables
 */
export const disposableTests = describe("Disposable", () => {
    it("Can be constructed", () => {
        using(new MockDisposable(), (d) => {
            expect(d).to.be.instanceof(MockDisposable);
        });
    });

    it("Should return a value from a callback", () => {
        const returned = using(new MockDisposable(), () => {
            return 1;
        });
        expect(returned).to.be.eq(1);
    });

    it("Should return a value from an async callback", async () => {
        const returned = await usingAsync(new MockDisposable(), async () => {
            return 2;
        });
        expect(returned).to.be.eq(2);
    });

    describe("isDisposed", () => {
        it("should return a correct value before and after disposition", () => {
            const d = new MockDisposable();
            expect(d.isDisposed()).to.be.eq(false);
            d.dispose();
            expect(d.isDisposed()).to.be.eq(true);
        });
    });

    describe("dispose()", () => {
        it("should be called on error", (done: MochaDone) => {
            try {
                using(new MockDisposable(), (d) => {
                    d.disposeCallback = () => { done(); };

                    d.whooops();
                });
            } catch {
                /** ignore */
            }
        });

        it("should be called with usingAsync()", (done: MochaDone) => {
            usingAsync(new MockDisposable(), async (d) => {
                d.disposeCallback = () => {
                    done();
                };
                return new Promise((resolve, reject) => {
                    setTimeout(resolve, 1);
                });
            });
        });

        it("should be called when async fails", (done: MochaDone) => {
            usingAsync(new MockDisposable(), async (d) => {
                d.disposeCallback = () => {
                    done();
                };
                return new Promise((resolve, reject) => {
                    setTimeout(reject, 1);
                });
            }).catch((err) => {
                /** ignore */
            });
        });

        it("should await dispose for asyncs with usingAsync()", async () => {
            class AsyncDispose {
                /** flag */
                public isDisposed = false;
                /** set isDisposed with a timeout */
                public async dispose() {
                    await new Promise((resolve) => setTimeout(() => {
                        this.isDisposed = true;
                        resolve();
                    }, 10));
                }
            }

            const asyncDispose = new AsyncDispose();
            await usingAsync(asyncDispose, async (d) => {
                /** */
            });
            expect(asyncDispose.isDisposed).to.be.eq(true);
        });

    });

});
