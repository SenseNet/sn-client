import { SigninResponse } from 'oidc-client'

export type CodeLoginResponse = Pick<SigninResponse, 'access_token' | 'expires_in' | 'scope' | 'token_type' | 'profile'>

export interface CodeLoginParams {
  clientId: string
  clientSecret: string
  identityServerUrl: string
  userId?: string | number
  appId?: string
  fetchMethod?: WindowOrWorkerGlobalScope['fetch']
}

export const codeLogin = async ({
  clientId,
  clientSecret,
  identityServerUrl,
  userId,
  appId,
  fetchMethod = window && window.fetch && window.fetch.bind(window),
}: CodeLoginParams) => {
  const configuration = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
    scope: encodeURIComponent('sensenet'),
  }

  const requestBody = Object.entries(configuration).reduce((acc, current, idx) => {
    return `${acc}${current[0]}=${current[1]}${idx === Object.entries(configuration).length - 1 ? '' : '&'}`
  }, '')

  const url = `${identityServerUrl}/connect/token`
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: requestBody,
  }

  const response = await fetchMethod(url, options)
  const authData: CodeLoginResponse = (await response.json?.()) ?? response.body ?? response

  if (userId && authData) {
    authData.profile = {
      sub: userId,
    }
  }

  appId && window?.sessionStorage?.setItem(`oidc.user:${identityServerUrl}:${appId}`, JSON.stringify(authData))

  return authData
}
