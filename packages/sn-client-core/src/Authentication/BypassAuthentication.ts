import { ObservableValue } from "@sensenet/client-utils/dist/ObservableValue";
import { User } from "@sensenet/default-content-types";
import { ConstantContent } from "../Repository/ConstantContent";
import { IAuthenticationService } from "./IAuthenticationService";

/**
 * Default authentication service that bypasses the authentication process
 */
export class BypassAuthentication implements IAuthenticationService {

    /**
     * Checks for update if neccessary. For BypassAuthentication always resolves immedietly with false
     */
    public async checkForUpdate(): Promise<boolean> {
        return false;
    }

    /**
     * Login method - not available for BypassAuthentication
     * @param username
     * @param password
     */
    public async login(username: string, password: string): Promise<boolean> {
        throw new Error("Not allowed when authentication is bypassed.");
    }

    /**
     * logout method - not available for BypassAuthentication
     */
    public async logout(): Promise<boolean> {
        throw new Error("Not allowed when authentication is bypassed.");
    }

    /**
     * Current user observable property - Will publish the Visitor user for BypassAuthentication
     */
    public currentUser: ObservableValue<User> = new ObservableValue<User>(ConstantContent.VISITOR_USER);

    /**
     * Disposes the service
     */
    public dispose() {
        /** */
    }

}
