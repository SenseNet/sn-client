/**
 * @module ODataApi
 */ /** */

// tslint:disable:naming-convention
/**
 * Represents a Batch Operation response from Batch Copy/Move/Delete action
 */
export interface IODataBatchResponse<T> {

    d: {
        __count: number,
        results: T[],

        errors: Array<{ content: T, error: any }>,
    };

}
