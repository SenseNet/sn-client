/**
 * @module Authentication
 */ /** */

import { ConstantContent, IAuthenticationService, Repository } from "@sensenet/client-core";
import { ObservableValue, PathHelper } from "@sensenet/client-utils";
import { User } from "@sensenet/default-content-types";
import { IOauthProvider } from "./IOauthProvider";
import { LoginResponse } from "./LoginResponse";
import { LoginState } from "./LoginState";
import { RefreshResponse } from "./RefreshResponse";
import { Token } from "./Token";
import { TokenPersist } from "./TokenPersist";
import { TokenStore } from "./TokenStore";

/**
 * This service class manages the JWT authentication, the session and the current login state.
 */
export class JwtService implements IAuthenticationService {

    private readonly jwtTokenKeyTemplate: string = "sn-${siteName}-${tokenName}";

    /**
     * Disposes the service
     */
    public dispose() {
        /** */
    }

    /**
     * Set of registered Oauth Providers
     */
    public oauthProviders: Set<IOauthProvider> = new Set<IOauthProvider>();

    /**
     * Observable value that will update with the current user on user change
     */
    public currentUser: ObservableValue<User> = new ObservableValue<User>(ConstantContent.VISITOR_USER);

    /**
     * This observable indicates the current state of the service
     * @default LoginState.Pending
     */
    public state: ObservableValue<LoginState> = new ObservableValue(LoginState.Pending);

    /**
     * The store for JWT tokens
     */
    private tokenStore: TokenStore =
        new TokenStore(this.repository.configuration.repositoryUrl, this.jwtTokenKeyTemplate, (this.repository.configuration.sessionLifetime === "session") ? TokenPersist.Session : TokenPersist.Expiration);

    /**
     * Executed before each Ajax call. If the access token has been expired, but the refresh token is still valid, it triggers the token refreshing call
     * @returns {Observable<boolean>} An observable with a variable that indicates if there was a refresh triggered.
     */
    public async checkForUpdate(): Promise<boolean> {
        if (this.tokenStore.AccessToken.IsValid()) {
            this.state.setValue(LoginState.Authenticated);
            return false;
        }
        if (!this.tokenStore.RefreshToken.IsValid()) {
            this.state.setValue(LoginState.Unauthenticated);
            return false;
        }
        this.state.setValue(LoginState.Pending);
        return await this.execTokenRefresh();
    }

    /**
     * Executes the token refresh call. Refresh the token in the Token Store and in the Service, updates the HttpService header
     * @returns {Observable<boolean>} An observable that will be completed with true on a succesfull refresh
     */
    private async execTokenRefresh(): Promise<boolean> {
        const response = await this.repository.fetch(PathHelper.joinPaths(this.repository.configuration.repositoryUrl, "sn-token/refresh"),
            {
                method: "POST",
                headers: {
                    "X-Refresh-Data": this.tokenStore.RefreshToken.toString(),
                    "X-Authentication-Type": "Token",
                },
                cache: "no-cache",
                credentials: "include",
            }, false);

        if (response.ok) {
            const json: RefreshResponse = await response.json();
            this.tokenStore.AccessToken = Token.FromHeadAndPayload(json.access);
            this.state.setValue(LoginState.Authenticated);
        } else {
            this.tokenStore.AccessToken = Token.CreateEmpty();
            this.state.setValue(LoginState.Unauthenticated);
        }
        return true;
    }

    /**
     * @param {BaseRepository} _repository the Repository reference for the Authentication. The service will read its configuration and use its HttpProvider
     * @constructs JwtService
     */
    constructor(protected readonly repository: Repository) {
        this.checkForUpdate();
    }

    /**
     * Updates the state based on a specific sensenet ECM Login Response
     * @param {LoginResponse} response
     */
    public handleAuthenticationResponse(response: LoginResponse): boolean {
        this.tokenStore.AccessToken = Token.FromHeadAndPayload(response.access);
        this.tokenStore.RefreshToken = Token.FromHeadAndPayload(response.refresh);
        if (this.tokenStore.AccessToken.IsValid()) {
            this.state.setValue(LoginState.Authenticated);
            return true;
        }
        this.state.setValue(LoginState.Unauthenticated);
        return false;
    }

    /**
     * It is possible to send authentication requests using this action. You provide the username and password and will get the User object as the response if the login operation was
     * successful or HTTP 403 Forbidden message if it wasn’t. If the username does not contain a domain prefix, the configured default domain will be used. After you logged in the user successfully,
     * you will receive a standard ASP.NET auth cookie which will make sure that your subsequent requests will be authorized correctly.
     *
     * The username and password is sent in clear text, always send these kinds of requests through HTTPS.
     * @param username {string} Name of the user.
     * @param password {string} Password of the user.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let userLogin = service.Login('alba', 'alba');
     * userLogin.subscribe({
     *  next: response => {
     *      console.log('Login success', response);
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    public async login(username: string, password: string): Promise<boolean> {
        this.state.setValue(LoginState.Pending);
        const authToken: string = new Buffer(`${username}:${password}`).toString("base64");
        const response = await this.repository.fetch(
            PathHelper.joinPaths(this.repository.configuration.repositoryUrl, "sn-token/login"),
            {
                method: "POST",
                headers: {
                    "X-Authentication-Type": "Token",
                    "Authorization": `Basic ${authToken}`,
                },
                cache: "no-cache",
                credentials: "include",
            },
            false,
        );

        if (response.ok) {
            const json: LoginResponse = await response.json();
            return this.handleAuthenticationResponse(json);
        } else {
            this.state.setValue(LoginState.Unauthenticated);
            return false;
        }
    }

    /**
     * Logs out the current user, sets the tokens to 'empty' and sends a Logout request to invalidate all Http only cookies
     * @returns {Observable<boolean>} An Observable that will be updated with the logout response
     */
    public async logout(): Promise<boolean> {
        this.tokenStore.AccessToken = Token.CreateEmpty();
        this.tokenStore.RefreshToken = Token.CreateEmpty();
        this.state.setValue(LoginState.Unauthenticated);
        this.currentUser.setValue(ConstantContent.VISITOR_USER);
        await this.repository.fetch(PathHelper.joinPaths(this.repository.configuration.repositoryUrl, "sn-token/logout"), {
            method: "POST",
            cache: "no-cache",
            credentials: "include",
        }, false);
        return true;
    }
}
