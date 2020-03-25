import { AuthenticationProvider, useOidcAuthentication, UserManagerSettings } from '@sensenet/authentication-oidc-react'
import { Repository } from '@sensenet/client-core'
import { RepositoryContext, useLogger } from '@sensenet/hooks-react'
import React, { lazy, ReactNode, Suspense, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FullScreenLoader } from '../components/FullScreenLoader'
import { NotificationComponent } from '../components/NotificationComponent'
import { useRepoUrlFromLocalStorage } from '../hooks'
import { getAuthConfig } from '../services/auth-service'

const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ '../components/login/login-page'))

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const { repoUrl, setRepoUrl } = useRepoUrlFromLocalStorage()
  const logger = useLogger('repository-provider')
  const history = useHistory()
  const [authConfig, setAuthConfig] = useState<UserManagerSettings>()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    async function getRepo() {
      if (!repoUrl) {
        return
      }
      try {
        const config = await getAuthConfig(repoUrl)
        setAuthConfig(config)
      } catch (error) {
        logger.debug({ data: error, message: `network error at ${repoUrl}` })
      }
    }
    getRepo()
  }, [logger, repoUrl])

  if (!authConfig || !repoUrl) {
    return (
      <Suspense fallback={<FullScreenLoader />}>
        <LoginPage
          handleSubmit={repoUrlFromLogin => {
            setRepoUrl(repoUrlFromLogin)
            setIsLoggingIn(true)
          }}
        />
        <NotificationComponent />
      </Suspense>
    )
  }

  return (
    <AuthenticationProvider isEnabled={true} configuration={authConfig} history={history}>
      {isLoggingIn ? <Login /> : null}
      <RepoProvider setIsLoggingIn={() => setIsLoggingIn(true)}>{children}</RepoProvider>
    </AuthenticationProvider>
  )
}

const Login = () => {
  const { login } = useOidcAuthentication()

  useEffect(() => {
    login()
  }, [login])

  return null
}

const RepoProvider = ({ children, setIsLoggingIn }: { children: ReactNode; setIsLoggingIn: () => void }) => {
  const { repoUrl, setRepoUrl } = useRepoUrlFromLocalStorage()
  const { oidcUser } = useOidcAuthentication()

  if (!repoUrl || !oidcUser) {
    return (
      <Suspense fallback={<FullScreenLoader />}>
        <LoginPage
          handleSubmit={repoUrlFromLogin => {
            if (repoUrl !== repoUrlFromLogin) {
              setRepoUrl(repoUrlFromLogin)
            }
            setIsLoggingIn()
          }}
        />
        <NotificationComponent />
      </Suspense>
    )
  }

  return (
    <RepositoryContext.Provider value={new Repository({ repositoryUrl: repoUrl, token: oidcUser.access_token })}>
      {children}
    </RepositoryContext.Provider>
  )
}
