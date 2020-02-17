/* eslint-disable @typescript-eslint/camelcase */
import { OIDCAuthenticationService, UserManager, UserManagerSettings } from '@sensenet/client-core'
import { applicationPaths } from '../application-paths'

let service: OIDCAuthenticationService
let currentRepoUrl: string

export const getAuthService = async (repoUrl: string) => {
  if (service && repoUrl === currentRepoUrl) {
    return service
  }

  const trimmedRepoUrl = repoUrl.replace(/\/\s*$/, '')
  const response = await fetch(`${trimmedRepoUrl}/odata.svc/('Root')/GetClientRequestParameters?clientType=adminui`)
  if (!response.ok) {
    throw new Error(`Could not load settings`)
  }

  const settings = await response.json()
  const mySettings: UserManagerSettings = {
    redirect_uri: window.location.origin + applicationPaths.loginCallback,
    response_type: 'code',
    scope: 'openid profile',
    automaticSilentRenew: true,
    loadUserInfo: true,
    includeIdTokenInSilentRenew: true,
    post_logout_redirect_uri: window.location.origin + applicationPaths.logOutCallback,
    popup_post_logout_redirect_uri: window.location.origin + applicationPaths.logOutCallback,
    popup_redirect_uri: window.location.origin + applicationPaths.loginCallback,
    extraQueryParams: { snrepo: trimmedRepoUrl },
  }

  const userManager = new UserManager({ ...settings, ...mySettings })
  service = new OIDCAuthenticationService({ userManager })
  currentRepoUrl = repoUrl
  return service
}
