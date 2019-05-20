import { GoogleOauthProvider } from '@sensenet/authentication-google'
import { OauthProvider } from '@sensenet/authentication-jwt'
import React from 'react'
import GoogleAuthButton from './GoogleAuthButton'

// tslint:disable-next-line:variable-name
export const OauthRow = ({ oAuthProvider }: { oAuthProvider: OauthProvider | GoogleOauthProvider }) => {
  return <GoogleAuthButton oAuthProvider={oAuthProvider as GoogleOauthProvider} />
}
