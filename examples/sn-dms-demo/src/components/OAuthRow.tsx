import { GoogleOauthProvider } from '@sensenet/authentication-google'
import { IOauthProvider } from '@sensenet/authentication-jwt'
import * as React from 'react'
import GoogleAuthButton from './GoogleAuthButton'

// tslint:disable-next-line:variable-name
export const OauthRow = ({ oAuthProvider }: { oAuthProvider: IOauthProvider |  GoogleOauthProvider }) => {
    return (
        <GoogleAuthButton oAuthProvider={oAuthProvider as  GoogleOauthProvider} />
    )
}
