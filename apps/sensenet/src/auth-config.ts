export type AuthServerType = 'SNAuth' | 'IdentityServer'

export interface AuthenticationConfig {
  authType: AuthServerType
}

export const defaultAuthConfig: AuthenticationConfig = {
  authType: 'SNAuth',
}
