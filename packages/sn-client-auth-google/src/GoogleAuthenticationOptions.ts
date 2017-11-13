export class GoogleAuthenticationOptions {
    public RedirectUri: string;
    public Scope: string[] = ['userinfo.email', 'userinfo.profile'];
    public ClientId: string;

    constructor(options: Partial<GoogleAuthenticationOptions> & {ClientId: string}) {
        if (!options.RedirectUri) {
            options.RedirectUri = window.location.origin;
        }
        Object.assign(this, options);
    }
}
