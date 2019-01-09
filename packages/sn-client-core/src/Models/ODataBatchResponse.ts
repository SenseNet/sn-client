/**
 * @module ODataApi
 */

/**
 * Represents a Batch Operation response from Batch Copy/Move/Delete action
 */
export interface ODataBatchResponse<T> {
  d: {
    __count: number
    results: T[]

    errors: Array<{ content: T; error: any }>
  }
}
