/* eslint-disable @typescript-eslint/camelcase */
import { OIDCAuthenticationService } from '@sensenet/client-core'

export const queryParameterNames = {
  returnUrl: 'returnUrl',
  message: 'message',
}

export const logoutActions = {
  logoutCallback: 'logoutCallback',
  logout: 'logout',
  loggedOut: 'loggedOut',
} as const

export const loginActions = {
  login: 'login',
  loginCallback: 'loginCallback',
  loginFailed: 'loginFailed',
  profile: 'profile',
  register: 'register',
} as const

const prefix = '/authentication'

export const applicationPaths = {
  defaultLoginRedirectPath: '/',
  apiAuthorizationPrefix: prefix,
  login: `${prefix}/${loginActions.login}`,
  loginFailed: `${prefix}/${loginActions.loginFailed}`,
  loginCallback: `${prefix}/${loginActions.loginCallback}`,
  register: `${prefix}/${loginActions.register}`,
  profile: `${prefix}/${loginActions.profile}`,
  logOut: `${prefix}/${logoutActions.logout}`,
  loggedOut: `${prefix}/${logoutActions.loggedOut}`,
  logOutCallback: `${prefix}/${logoutActions.logoutCallback}`,
  identityRegisterPath: '/Identity/Account/Register',
  identityManagePath: '/Identity/Account/Manage',
}

const authService = new OIDCAuthenticationService({
  client_id: 'spa',
  redirect_uri: `http://localhost:8080${applicationPaths.loginCallback}`,
  response_type: 'code',
  scope: 'openid profile',
  automaticSilentRenew: true,
  loadUserInfo: true,
  includeIdTokenInSilentRenew: true,
  post_logout_redirect_uri: 'http://localhost:8080',
})

export default authService
