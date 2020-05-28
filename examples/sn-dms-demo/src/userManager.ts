/* eslint-disable @typescript-eslint/camelcase */
import { UserManagerSettings } from 'oidc-client'
import { createUserManager } from 'redux-oidc'

export const repositoryUrl = 'https://netcore-service.test.sensenet.com/'

export const configuration: UserManagerSettings = {
  client_id: 'spa',
  redirect_uri: `${window.location.origin}/authentication/callback`,
  response_type: 'code',
  post_logout_redirect_uri: `${window.location.origin}/`,
  scope: 'openid profile sensenet',
  authority: 'https://is.test.sensenet.com/',
  silent_redirect_uri: `${window.location.origin}/authentication/silent_callback`,
  extraQueryParams: { snrepo: repositoryUrl },
}

export const userManager = createUserManager(configuration)
