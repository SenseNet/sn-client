/**
 * The async variant of the Array.filter() method that
 * @param values An iterable of elements to filter
 * @param callbackFn The async callback that will be executed on the elements
 * @returns Promise<T[]>
 */
export const filterAsync = async <T>(values: Iterable<T>, callbackFn: (entry: T) => Promise<boolean>) => {
  const returns = []
  for (const value of values) {
    ;(await callbackFn(value)) && returns.push(value)
  }
  return returns
}

declare global {
  /**
   * Defines an array of elements
   */
  export interface Array<T> {
    /**
     * Returns a promise with a new array of elements that meets the specified async callback
     */
    filterAsync: (callbackFn: (entry: T) => Promise<boolean>) => Promise<T[]>
  }
}
;(Array.prototype as any).filterAsync = function(callbackFn: (entry: any) => Promise<boolean>) {
  return filterAsync(this, callbackFn)
}
