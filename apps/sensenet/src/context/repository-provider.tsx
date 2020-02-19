import { Repository } from '@sensenet/client-core'
import { RepositoryContext } from '@sensenet/hooks-react'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { useRepoUrlFromLocalStorage } from '../hooks'
import { getAuthService } from '../services/auth-service'
import { FullScreenLoader } from '../components/FullScreenLoader'

const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ '../components/login/login-page'))

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const { repoUrl } = useRepoUrlFromLocalStorage()
  const [repository, setRepository] = useState<Repository>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getRepo() {
      if (!repoUrl) {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      const authService = await getAuthService(repoUrl)
      const token = await authService.getAccessToken()
      if (!token) {
        setIsLoading(false)
        return
      }
      setRepository(new Repository({ repositoryUrl: repoUrl, token }))
      setIsLoading(false)
    }
    getRepo()
  }, [repoUrl])

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
