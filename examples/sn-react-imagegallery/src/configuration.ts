import { CodeLoginParams } from '@sensenet/authentication-oidc-react'

export const repositoryUrl = 'https://dev.demo.sensenet.com'

export const configuration: CodeLoginParams = {
  clientId: process.env.REACT_APP_CLIENT_ID ?? '', // businesscat clientId for dev.demo.sensenet.com
  clientSecret: process.env.REACT_APP_CLIENT_SECRET ?? '',
  identityServerUrl: 'https://is.demo.sensenet.com',
  appId: '7cYLChuhJxyGb7BS', //externalSPA clientId for dev.demo.sensenet.com
}
