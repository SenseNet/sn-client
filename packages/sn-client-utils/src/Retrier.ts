
/**
 * @module Retrier
 * @preferred
 *
 * @description Module for Retrier.
 *
 */ /** */

import { RetrierOptions } from "./RetrierOptions";

/**
 * Utility class for retrying operations.
 * Usage example:
 * ```
 *          const methodToRetry: () => Promise<boolean> = async () => {
 *              let hasSucceeded = false;
 *              // ...
 *              // custom logic
 *              // ...
 *              return hasSucceeded;
 *          }
 *          const retrierSuccess = await Retrier.Create(methodToRetry)
 *              .Setup({
 *                  retries: 3,
 *                  retryIntervalMs: 1,
 *                  timeoutMs: 1000
 *              })
 *              .Run();
 * ```
 */
export class Retrier {

    private isRunning: boolean = false;

    /**
     * Factory method for creating a Retrier
     * @param {()=>Promise<boolean>} callback The method that will be invoked on each try
     */
    public static Create(callback: () => Promise<boolean>) {
        return new Retrier(callback, new RetrierOptions());
    }

    private constructor(
        private callback: () => Promise<boolean>,
        public readonly options: RetrierOptions) {
    }

    private async wait(ms: number) {
        return new Promise<any>((resolve, reject) => {
            setTimeout(resolve, ms);
        });
    }

    /**
     * Method to override the default Retrier settings.
     * @param {Partial<RetrierOptions>} options The options to be overridden
     * @throws Error if the Retrier is running.
     * @returns the Retrier instance
     */
    public Setup(options: Partial<RetrierOptions>) {
        if (this.isRunning) {
            throw Error("Retrier already started!");
        }
        Object.assign(this.options, options);
        return this;
    }

    /**
     * Public method that starts the Retrier
     * @throws Error if the Retrier is already started.
     * @returns {Promise<boolean>} A boolean value that indicates if the process has been succeeded.
     */
    public async Run(): Promise<boolean> {

        if (this.isRunning) {
            throw Error("Retrier already started!");
        }

        let succeeded = false;
        let retries = 0;
        let timedOut = false;

        this.isRunning = true;

        setTimeout(() => {
            if (!succeeded) {
                timedOut = true;
            }
        }, this.options.timeoutMs);

        while (!succeeded && !timedOut && (this.options.Retries > retries)) {
            retries++;
            if (this.options.onTry) {
                this.options.onTry();
            }
            succeeded = await this.callback();
            if (!succeeded) {
                await this.wait(this.options.RetryIntervalMs);
            }
        }

        if (succeeded) {
            if (!timedOut && this.options.onSuccess) {
                this.options.onSuccess();
            }
        } else {
            if (this.options.onFail) {
                this.options.onFail();
            }
        }
        return succeeded;
    }
}
