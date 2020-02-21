import { Repository } from '@sensenet/client-core'
import { RepositoryContext, useLogger } from '@sensenet/hooks-react'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { useRepoUrlFromLocalStorage } from '../hooks'
import { getAuthService } from '../services/auth-service'
import { FullScreenLoader } from '../components/FullScreenLoader'

const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ '../components/login/login-page'))

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const { repoUrl } = useRepoUrlFromLocalStorage()
  const logger = useLogger('repository-provider')
  const [repository, setRepository] = useState<Repository>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function subscribeToAuthEvent() {
      if (!repoUrl) {
        return
      }
      const authService = await getAuthService(repoUrl)
      authService.userManager.events.addUserSignedOut(() => {
        setRepository(undefined)
        setIsLoading(false)
      })
    }
    subscribeToAuthEvent()
  }, [repoUrl])

  useEffect(() => {
    async function getRepo() {
      if (!repoUrl) {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {
        const authService = await getAuthService(repoUrl)
        const token = await authService.getAccessToken()
        if (!token) {
          setIsLoading(false)
          return
        }
        setRepository(new Repository({ repositoryUrl: repoUrl, token }))
        setIsLoading(false)
      } catch (error) {
        logger.debug({ data: error, message: `network error at ${repoUrl}` })
        setIsLoading(false)
      }
    }
    getRepo()
  }, [logger, repoUrl])

  if (isLoading) {
    return null
  }

  if (!repository) {
    return (
      <Suspense fallback={<FullScreenLoader />}>
        <LoginPage />
      </Suspense>
    )
  }

  return <RepositoryContext.Provider value={repository}>{children}</RepositoryContext.Provider>
}
