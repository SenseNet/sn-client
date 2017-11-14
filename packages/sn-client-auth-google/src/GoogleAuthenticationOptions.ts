/**
 * Options for Google OAuth Authentication
 */
export class GoogleAuthenticationOptions {
    /**
     * Defines the Redirect Uri. Will fall back to 'window.location.origin', if not provided
     */
    public RedirectUri: string;
    /**
     * Scope settings for Google Oauth
     * Visit the following link to read more about Google Scopes:
     * https://developers.google.com/identity/protocols/googlescopes
     */
    public Scope: string[] = ['email', 'profile'];
    /**
     * Your application's ClientId, provided by Google
     */
    public ClientId: string;

    constructor(options: Partial<GoogleAuthenticationOptions> & {ClientId: string}) {
        if (!options.RedirectUri) {
            options.RedirectUri = window.location.origin + '/';
        }
        Object.assign(this, options);
    }
}
