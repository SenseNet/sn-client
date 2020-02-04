/* eslint-disable @typescript-eslint/camelcase */
import { OIDCAuthenticationService } from '@sensenet/client-core'
import { applicationPaths } from '../application-paths'

const authService = new OIDCAuthenticationService({
  client_id: 'spa',
  redirect_uri: `http://localhost:8080${applicationPaths.loginCallback}`,
  response_type: 'code',
  scope: 'openid profile',
  automaticSilentRenew: true,
  loadUserInfo: true,
  includeIdTokenInSilentRenew: true,
  post_logout_redirect_uri: `http://localhost:8080${applicationPaths.logOutCallback}`,
  popup_post_logout_redirect_uri: `http://localhost:8080${applicationPaths.logOutCallback}`,
  popup_redirect_uri: `http://localhost:8080${applicationPaths.loginCallback}`,
  isPopupEnabled: true,
})

export default authService
