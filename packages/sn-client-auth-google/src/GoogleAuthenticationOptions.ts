/**
 * Options for Google OAuth Authentication
 */
export class GoogleAuthenticationOptions {
  /**
   * Defines the Redirect Uri. Will fall back to 'window.location.origin', if not provided
   */
  public redirectUri!: string
  /**
   * Scope settings for Google Oauth
   * Visit the following link to read more about Google Scopes:
   * https://developers.google.com/identity/protocols/googlescopes
   */
  public scope: string[] = ['email', 'profile']
  /**
   * Your application's ClientId, provided by Google
   */
  public clientId!: string

  constructor(options: Partial<GoogleAuthenticationOptions> & { clientId: string }) {
    if (!options.redirectUri) {
      options.redirectUri = window.location.origin + '/'
    }
    Object.assign(this, options)
  }
}
