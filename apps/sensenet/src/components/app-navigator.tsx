import React, { useEffect, useState } from 'react'
import { useRepository } from '../context/RepositoryContext'
import authService from '../services/auth-service'
import ApiAuthorizationRoutes from './login/api-authorization-routes'
import { LoginPage } from './login/login-page'
import { DesktopLayout } from './layout/DesktopLayout'
import { MainRouter } from './MainRouter'

export function AppNavigator() {
  const { repository } = useRepository()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (!repository) {
      return
    }

    const populateAuthenticationState = async () => {
      const authenticated = await authService.isAuthenticated(repository.configuration.repositoryUrl)
      setIsAuthenticated(authenticated)
    }
    const subscription = authService.user.subscribe(async () => {
      setIsAuthenticated(false)
      await populateAuthenticationState()
    })
    populateAuthenticationState()
    return () => subscription.dispose()
  }, [repository])

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
