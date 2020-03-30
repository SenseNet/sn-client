import { History } from 'history'
import React, { ReactNode, useContext, useEffect } from 'react'
import { getUserManager } from '../authentication-service'
import { authenticateUser } from '../oidc-service'
import { Authenticating } from './authenticating'
import { AuthenticationContext } from './authentication-provider'

type OidcSecureProps = {
  children: ReactNode
  history: History
}

/**
 * Component redirecting to login screen if no user found or the access token expired
 */
export const OidcSecure = ({ children, history }: OidcSecureProps) => {
  const context = useContext(AuthenticationContext)

  if (!context) {
    throw new Error('useOidcAuthentication must be used within a AuthenticationProvider')
  }
  const { oidcUser, authenticating } = context

  useEffect(() => {
    authenticateUser(getUserManager()!, history.location, history)()
  }, [history])

  const requiredAuth = !oidcUser || oidcUser?.expired === true

  const authenticatingComponent = authenticating || <Authenticating />
  return requiredAuth ? <>{authenticatingComponent}</> : <>{children}</>
}
