import React, { PropsWithChildren, useEffect } from 'react'
import { Redirect, Route } from 'react-router'
import authService, { applicationPaths, queryParameterNames } from '../../services/auth-service'
import { useAuthenticated } from './useAuthenticatedCheck'

export default function AuthorizedRoute({ path, children }: PropsWithChildren<{ path: string }>) {
  const { isReady, isAuthenticated, setIsReady, setIsAuthenticated, populateAuthenticationState } = useAuthenticated()

  useEffect(() => {
    const subscription = authService.subscribe(async () => {
      setIsReady(false)
      setIsAuthenticated(false)
      await populateAuthenticationState()
    })
    return () => {
      authService.unsubscribe(subscription)
    }
  }, [populateAuthenticationState, setIsAuthenticated, setIsReady])

  if (!isReady) {
    return null
  } else {
    const redirectUrl = `${applicationPaths.login}?${queryParameterNames.returnUrl}=${encodeURI(window.location.href)}`
    return <Route path={path}>{isAuthenticated ? children : <Redirect to={redirectUrl} />}</Route>
  }
}
