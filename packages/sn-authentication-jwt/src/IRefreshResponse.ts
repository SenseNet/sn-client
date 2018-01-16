/**
 * @module Authentication
 */ /** */

// tslint:disable:naming-convention

/**
 * This class represents a plain response body that is returned from Sense/NET ECM in case of a succesfully login.
 */
export interface IRefreshResponse {
    /**
     * The Access Token head and payload in a Base64 encoded format
     */
    access: string;
}
