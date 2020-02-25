import { Repository } from '@sensenet/client-core'
import { ValueObserver } from '@sensenet/client-utils'
import { RepositoryContext, useLogger } from '@sensenet/hooks-react'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { FullScreenLoader } from '../components/FullScreenLoader'
import { useRepoUrlFromLocalStorage } from '../hooks'
import { getAuthService } from '../services/auth-service'
import { NotificationComponent } from '../components/NotificationComponent'

const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ '../components/login/login-page'))

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const { repoUrl } = useRepoUrlFromLocalStorage()
  const logger = useLogger('repository-provider')
  const [repository, setRepository] = useState<Repository>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let subscription: ValueObserver<any> | undefined
    const createRepository = (repositoryUrl: string, token?: string) => {
      if (!token) {
        setIsLoading(false)
        return
      }
      setRepository(new Repository({ repositoryUrl, token }))
      setIsLoading(false)
    }

    async function getRepo() {
      if (!repoUrl) {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {
        const authService = await getAuthService(repoUrl)

        subscription = authService.user.subscribe(user => {
          if (!user) {
            setRepository(undefined)
            setIsLoading(false)
          } else {
            createRepository(repoUrl, user.access_token)
          }
        })

        const token = await authService.getAccessToken()
        createRepository(repoUrl, token)
      } catch (error) {
        logger.debug({ data: error, message: `network error at ${repoUrl}` })
        setIsLoading(false)
      }
    }
    getRepo()
    return () => subscription?.dispose()
  }, [logger, repoUrl])

  if (isLoading) {
    return null
  }

  if (!repository) {
    return (
      <Suspense fallback={<FullScreenLoader />}>
        <LoginPage />
        <NotificationComponent />
      </Suspense>
    )
  }

  return <RepositoryContext.Provider value={repository}>{children}</RepositoryContext.Provider>
}
