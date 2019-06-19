/**
 * @module ODataApi
 */

/**
 * Generic Class that represents a basic OData Response structure
 */
export interface ODataCollectionResponse<T> {
  d: {
    results: T[]
    __count: number
  }
}
