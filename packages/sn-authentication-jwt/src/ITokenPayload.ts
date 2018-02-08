 /**
  * This interface represents payload data, as it is recieved from sensenet ECM.
  */
export interface ITokenPayload {
    /**
     * issuer: identifies the principal that issued the token
     */
    iss: string;

    /**
     * subject: identifies the principal that is the subject of the token
     */
    sub: string;

    /**
     * audience: identifies the recipients that the token is intended for
     */
    aud: string;

    /**
     * expiration: time identifies the time whereupon the token will not be accepted
     */
    exp: number;

    /**
     * issued at: identifies the time when the token was issued
     */
    iat: number;

    /**
     * not before: identifies the time before that the token can not be accepted
     */
    nbf: number;

    /**
     * name: identifies the name of the user whom the token was issued to
     */
    name: string;
}
