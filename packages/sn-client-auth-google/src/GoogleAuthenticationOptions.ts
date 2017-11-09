export class GoogleAuthenticationOptions {
    public RedirectUri: string;
    public Scope: string[] = ['userinfo.email', 'userinfo.profile'];
    public ClientId: string;
}
