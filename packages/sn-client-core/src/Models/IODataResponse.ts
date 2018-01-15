import {IMetadata} from "./IMetadata";

/**
 * Generic Class that represents a basic OData Response structure
 */
export interface IODataResponse<T> {
    // tslint:disable-next-line:naming-convention
    d: T & { __metadata?: IMetadata};
}
