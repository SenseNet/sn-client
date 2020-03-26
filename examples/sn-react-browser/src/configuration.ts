/* eslint-disable @typescript-eslint/camelcase */
import { UserManagerSettings } from '@sensenet/authentication-oidc-react'

export const repositoryUrl = 'https://netcore-service.test.sensenet.com/'

export const configuration: UserManagerSettings = {
  client_id: 'spa',
  redirect_uri: 'http://localhost:3000/authentication/callback',
  response_type: 'code',
  post_logout_redirect_uri: 'http://localhost:3000/',
  scope: 'openid profile',
  authority: 'https://is.test.sensenet.com/',
  silent_redirect_uri: 'http://localhost:3000/authentication/silent_callback',
  extraQueryParams: { snrepo: repositoryUrl },
}
