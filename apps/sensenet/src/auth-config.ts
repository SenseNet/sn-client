export type AuthServerType = 'SNAuth' | 'IdentityServer' | 'Local'

export interface AuthenticationConfig {
  authType: AuthServerType
}

// Use process.env.AUTH_TYPE if available (from build), otherwise default to 'SNAuth'
export const defaultAuthConfig: AuthenticationConfig = {
  authType: (process.env.AUTH_TYPE || 'SNAuth') as AuthServerType,
}
