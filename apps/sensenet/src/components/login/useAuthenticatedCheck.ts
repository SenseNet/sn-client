import { useCallback, useEffect, useState } from 'react'
import { useRepository } from '@sensenet/hooks-react'
import authService from '../../services/auth-service'

export function useAuthenticated() {
  const [isReady, setIsReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const repo = useRepository()

  const populateAuthenticationState = useCallback(async () => {
    const authenticated = await authService.isAuthenticated(repo.configuration.repositoryUrl)
    setIsReady(true)
    setIsAuthenticated(authenticated)
  }, [repo.configuration.repositoryUrl])

  useEffect(() => {
    populateAuthenticationState()
  }, [populateAuthenticationState])

  return { isReady, isAuthenticated, populateAuthenticationState, setIsReady, setIsAuthenticated }
}
