import { IDisposable } from "@sensenet/client-utils/dist/Disposable";

/**
 * Interface that represents a basic structure for an additional OAuth Provider
 */
export interface IOauthProvider extends IDisposable {
    /**
     * Method that retrieves the token info
     */
    getToken(): Promise<string>;

    /**
     * Method that handles the user login. Should be responsible for updating the Authentication State as well.
     */
    login(token: string): Promise<any>;
}
