/**
 * Options class for Retrier
 */
export class RetrierOptions {

    /**
     * The default value for retries
     */
    public static readonly RETRIES_DEFAULT = 10;
    private retries: number = RetrierOptions.RETRIES_DEFAULT;
    /**
     * How many times should retry the operation
     */
    public get Retries(): number {
        return this.retries;
    }
    public set Retries(v: number) {
        this.retries = v;
    }

    /**
     * The default interval between retries
     */
    public static readonly RETRY_INTERVAL_MS_DEFAULT = 10;
    private retryIntervalMs: number;
    /**
     * The interval between tries in milliseconds
     */
    public get RetryIntervalMs(): number {
        return this.retryIntervalMs !== undefined ? this.retryIntervalMs : RetrierOptions.RETRY_INTERVAL_MS_DEFAULT;
    }
    public set RetryIntervalMs(v: number) {
        this.retryIntervalMs = v;
    }

    /**
     * The default timeout in millisecs
     */
    public static readonly TIMEOUT_MS_DEFAULT = 1000;
    private timeoutMs: number;
    /**
     * The Timeout interval in milliseconds
     */
    public get TimeoutMs(): number {
        return this.timeoutMs !== undefined ? this.timeoutMs : RetrierOptions.TIMEOUT_MS_DEFAULT;
    }
    public set TimeoutMs(v: number) {
        this.timeoutMs = v;
    }

    /**
     * Optional callback, triggered right before each try
     */
    public onTry?: () => void;
    /**
     * Optional callback, triggered on success
     */
    public onSuccess?: () => void;
    /**
     * Optional callback, triggered on fail (timeout or too many retries)
     */
    public onFail?: () => void;
}
