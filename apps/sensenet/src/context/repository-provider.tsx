import { Repository } from '@sensenet/client-core'
import { RepositoryContext } from '@sensenet/hooks-react'
import React, { useEffect, useState } from 'react'
import { LoginPage } from '../components/login/login-page'
import theme from '../components/theme'
import { useRepoUrlFromLocalStorage } from '../hooks'
import { getAuthService } from '../services/auth-service'
import { ThemeProvider } from '.'

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
      const user = await authService.getUser()
      const token = await authService.getAccessToken()
      if (!user || !token) {
        setIsLoading(false)
        return
      }
      setRepository(new Repository({ repositoryUrl: repoUrl, token }))
      setIsLoading(false)
    }
    getRepo()
  }, [repoUrl, repository])

  if (isLoading) {
    return null
  }

  if (!repository) {
    return (
      <ThemeProvider theme={theme}>
        <LoginPage />
      </ThemeProvider>
    )
  }

  return <RepositoryContext.Provider value={repository}>{children}</RepositoryContext.Provider>
}
