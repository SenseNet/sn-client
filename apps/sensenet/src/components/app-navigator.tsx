import React, { useEffect, useState } from 'react'
import authService from '../services/auth-service'
import ApiAuthorizationRoutes from './login/api-authorization-routes'
import { LoginPage } from './login/login-page'
import { DesktopLayout } from './layout/DesktopLayout'
import { MainRouter } from './MainRouter'

export function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const populateAuthenticationState = async () => {
      const authenticated = await authService.isAuthenticated()
      setIsAuthenticated(authenticated)
    }
    const subscription = authService.subscribe(async () => {
      setIsAuthenticated(false)
      await populateAuthenticationState()
    })
    populateAuthenticationState()
    return () => {
      authService.unsubscribe(subscription)
    }
  }, [])

  if (isAuthenticated) {
    return (
      <DesktopLayout>
        <MainRouter />
      </DesktopLayout>
    )
  }

  return (
    <>
      <ApiAuthorizationRoutes />
      <LoginPage />
    </>
  )
}
