/**
 * @module Authentication
 */ /** */

import { IDisposable, ObservableValue } from "@sensenet/client-utils";
import { User } from "@sensenet/default-content-types";

/**
 * Interface that describes how injectable Authentication Services should work
 */
export interface IAuthenticationService extends IDisposable {

    /**
     * Executes a check for the current state
     * @returns A promise that will be resolved with a boolean, that indicates if a refres was needed.
     */
    checkForUpdate(): Promise<boolean>;

    /**
     * Tries to log in with a specified credentials. Updates the current state subject based on the login response.
     * @param {string} username The user's name
     * @param {string} password The user's password
     * @returns {Promise<boolean>} that indicates if the login was successful
     */
    login(username: string, password: string): Promise<boolean>;

    /**
     * Logs out the current user, invalidates the session
     * @returns {Observable<boolean>} that indicates if logging out was successful
     */
    logout(): Promise<boolean>;

    // ToDo: Pub/Sub
    currentUser: ObservableValue<User>;

}
