import { History } from 'history'
import React, { ReactNode, useContext, useEffect, useMemo } from 'react'
import { getUserManager } from '../authentication-service'
import { authenticateUser, isRequireAuthentication } from '../oidc-service'
import { Authenticating } from './authenticating'
import { AuthenticationContext } from './authentication-provider'

const useOidcSecure = (history: History) => {
  const context = useContext(AuthenticationContext)

  if (!context) {
    throw new Error('useOidcAuthentication must be used within a AuthenticationProvider')
  }
  const { isEnabled, oidcUser, authenticating } = context

  useEffect(() => {
    console.info('Protection : ', isEnabled)
    if (isEnabled) {
      console.info('Protected component mounted')
      const usermanager = getUserManager()
      if (!usermanager) {
        console.error('No usermanager')
        return
      }
      authenticateUser(usermanager, history.location, history)()
    }
    return () => {
      console.info('Protected component unmounted')
    }
  }, [isEnabled, history])
  return { oidcUser, authenticating, isEnabled }
}

type OidcSecureProps = {
  children: ReactNode
  history: History
}

export const OidcSecure = ({ children, history }: OidcSecureProps) => {
  const { oidcUser, authenticating, isEnabled } = useOidcSecure(history)
  const requiredAuth = useMemo(() => isRequireAuthentication(oidcUser, false) && isEnabled, [isEnabled, oidcUser])
  const authenticatingComponent = authenticating || Authenticating
  return requiredAuth ? <>{authenticatingComponent}</> : <>{children}</>
}
