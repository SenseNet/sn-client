import React, { useEffect, useState } from 'react'
import { Redirect, Route, RouteProps } from 'react-router'
import { useRepository } from '../../context'
import authService, { applicationPaths } from '../../services/auth-service'

export default function AuthorizedRoute({ children, ...rest }: RouteProps) {
  const { repository, isRepositoryFound } = useRepository()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    async function getIsAuthenticated() {
      if (isRepositoryFound === undefined) {
        return
      }
      if (!repository) {
        setIsAuthenticated(false)
        setIsLoaded(true)
        return
      }
      const authenticated = await authService.isAuthenticated(repository!.configuration.repositoryUrl)
      setIsAuthenticated(authenticated)
      setIsLoaded(true)
    }
    getIsAuthenticated()
  }, [isRepositoryFound, repository])

  /**
   * Until we don't know if we have a repository or not just show null
   */
  if (isRepositoryFound === undefined || !isLoaded) {
    return null
  }

  return (
    <Route
      {...rest}
      render={({ location }) => {
        return isAuthenticated ? (
          children
        ) : (
          <Redirect to={{ pathname: applicationPaths.login, state: { from: location } }} />
        )
      }}
    />
  )
}
