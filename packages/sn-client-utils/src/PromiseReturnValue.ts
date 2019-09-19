/**
 * Type helper that extracts the return value from a PromiseLike type
 * E.g. PromiseReturnValue<Promise<T>> will be evaluated as T
 */
export type PromiseReturnValue<T> = T extends PromiseLike<infer U> ? U : never
