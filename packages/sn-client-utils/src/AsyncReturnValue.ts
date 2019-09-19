/**
 * Type helper that extracts the return value from an async method
 * E.g. PromiseReturnValue<Promise<T>> will be evaluated as T
 */
export type AsyncReturnValue<T> = T extends (...args: any[]) => PromiseLike<infer U> ? U : never
