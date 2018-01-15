/**
 * Desribes content metadata action information that can be requested on OData
 */
export interface IMetadataAction {
    title: string;
    name: string;
    target: string;
    forbidden: boolean;
    parameters: Array<{
        name: string,
        type: string,
        required: boolean,
    }>;
}
