import React, { useEffect, useRef } from 'react'
import { JwtService } from '@sensenet/authentication-jwt'
import { addGoogleAuth, GoogleOauthProvider } from '@sensenet/authentication-google'
import { useRepository } from '../../hooks'
import { OAuthButton } from './OAuthButton'

export const GoogleAuthButton = () => {
  const repository = useRepository()
  const googleOauthProvider = useRef<GoogleOauthProvider>()
  useEffect(() => {
    const jwt = new JwtService(repository)
    googleOauthProvider.current = addGoogleAuth(jwt, {
      clientId: '', // We are going to add this later
    })
    return () => {
      jwt.dispose()
      googleOauthProvider.current && googleOauthProvider.current.dispose()
    }
  }, [repository])

  const onClickHandler = () => {
    googleOauthProvider.current && googleOauthProvider.current.login()
  }

  return <OAuthButton buttonProps={{ onClick: onClickHandler, disabled: true }} buttonText="Google" iconName="google" />
}
