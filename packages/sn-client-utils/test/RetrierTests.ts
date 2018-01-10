import * as Chai from "chai";
import { Retrier } from "../src";
const expect = Chai.expect;

/**
 * Retrier tests
 */
export const retrierTests = describe("Retrier", () => {
    describe("Counter", () => {
        it("Should be able to count to 3", async () => {
            let count = 0;
            await Retrier.Create(async () => {
                count = count + 1;
                return count === 3;
            }).Run();
            expect(count).to.be.eq(3);
        });
    });

    describe("events", () => {
        it("should trigger onSuccess on success", async () => {
            let triggered = false;
            await Retrier.Create(async () => true)
                .Setup({
                    onSuccess: () => {
                        triggered = true;
                    },
                }).Run();

            expect(triggered).to.be.eq(true);
        });

        it("should trigger onTimeout on timeout", async () => {
            let triggered = false;
            await Retrier.Create(async () => false)
                .Setup({
                    onFail: () => {
                        triggered = true;
                    },
                    timeoutMs: 1,
                }).Run();

            expect(triggered).to.be.eq(true);
        });

        it("should trigger onTry on each try", async () => {
            let triggered = false;
            await Retrier.Create(async () => true)
                .Setup({
                    onTry: () => {
                        triggered = true;
                    },
                })
                .Run();
            expect(triggered).to.be.eq(true);
        });
    });

    it("should work with an example test", async () => {
        const funcToRetry: () => Promise<boolean> = async () => {
            const hasSucceeded = false;
            // ...
            // custom logic
            // ...
            return hasSucceeded;
        };
        const retrierSuccess = await Retrier.Create(funcToRetry)
            .Setup({
                Retries: 3,
                RetryIntervalMs: 1,
                timeoutMs: 1000,
            })
            .Run();

        expect(retrierSuccess).to.be.eq(false);
    });

    it("should throw error when started twice", async () => {
        const retrier = Retrier.Create(async () => false);
        const runPromise = retrier.Run();
        try {
            await retrier.Run();
            throw Error("Should have been failed");
        } catch (error) {
            // ignore
        }
    });

    it("should throw an error when trying to set up after started", () => {
        const retrier = Retrier.Create(async () => false);
        retrier.Run();
        expect(() => {
            retrier.Setup({
                Retries: 2,
            });
        }).to.throw();
    });
});
