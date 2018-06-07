import * as React from 'react'
import GoogleAuthButton from './GoogleAuthButton'

// tslint:disable-next-line:variable-name
export const OauthRow = ({ oAuthProvider }) => {
    return (
        <GoogleAuthButton oAuthProvider={oAuthProvider} />
    )
}
