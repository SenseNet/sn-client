/**
 * @module ODataApi
 */ /** */

/**
 * Generic Class that represents a basic OData Response structure
 */

export interface IODataCollectionResponse<T> {
    // tslint:disable-next-line:naming-convention
    d: {
        results: T[];
        __count: number;
    };
}
