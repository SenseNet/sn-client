/* eslint-disable @typescript-eslint/camelcase */
import { UserManagerSettings } from '@sensenet/authentication-oidc-react'
import { applicationPaths } from '../application-paths'

let config: UserManagerSettings
let currentRepoUrl: string

export const getAuthConfig = async (repoUrl: string) => {
  if (config && repoUrl === currentRepoUrl) {
    return config
  }

  const trimmedRepoUrl = repoUrl.replace(/\/\s*$/, '')
  const response = await fetch(`${trimmedRepoUrl}/odata.svc/('Root')/GetClientRequestParameters?clientType=adminui`)
  if (!response.ok) {
    throw new Error(`Could not load settings`)
  }

  const settings = await response.json()
  const mySettings: UserManagerSettings = {
    automaticSilentRenew: true,
    redirect_uri: window.location.origin + applicationPaths.loginCallback,
    response_type: 'code',
    scope: 'openid profile sensenet',
    post_logout_redirect_uri: `${window.location.origin}?repoUrl=${repoUrl}`,
    silent_redirect_uri: window.location.origin + applicationPaths.silentCallback,
    extraQueryParams: { snrepo: trimmedRepoUrl },
  }

  const userManagerSettings = { ...settings, ...mySettings }
  currentRepoUrl = repoUrl
  return userManagerSettings
}
