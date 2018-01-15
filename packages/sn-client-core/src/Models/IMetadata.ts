import { IMetadataAction } from "./IMetadataAction";

/**
 * Desribes content metadata information that can be requested on OData
 */
export interface IMetadata {
    uri?: string;
    type: string;
    actions: IMetadataAction[];
    functions: IMetadataAction[];
}
