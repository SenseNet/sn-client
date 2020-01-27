import { useCallback, useEffect, useState } from 'react'
import { useRepository } from '../../context/RepositoryContext'
import authService from '../../services/auth-service'

export function useAuthenticated() {
  const [isReady, setIsReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { repository } = useRepository()

  const populateAuthenticationState = useCallback(async () => {
    if (!repository) {
      return
    }

    const authenticated = await authService.isAuthenticated(repository.configuration.repositoryUrl)
    setIsReady(true)
    setIsAuthenticated(authenticated)
  }, [repository])

  useEffect(() => {
    populateAuthenticationState()
  }, [populateAuthenticationState])

  return { isReady, isAuthenticated, populateAuthenticationState, setIsReady, setIsAuthenticated }
}
