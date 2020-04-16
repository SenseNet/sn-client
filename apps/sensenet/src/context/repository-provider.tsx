import { AuthenticationProvider, useOidcAuthentication, UserManagerSettings } from '@sensenet/authentication-oidc-react'
import { Repository } from '@sensenet/client-core'
import { RepositoryContext, useLogger } from '@sensenet/hooks-react'
import React, { lazy, ReactNode, Suspense, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FullScreenLoader } from '../components/full-screen-loader'
import { NotificationComponent } from '../components/NotificationComponent'
import { getAuthConfig } from '../services/auth-config'

const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ '../components/login/login-page'))

export const authConfigKey = 'sn-oidc-config'

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const [repoUrl, setRepoUrl] = useState<string>()
  const logger = useLogger('repository-provider')
  const history = useHistory()
  const [authConfig, setAuthConfig] = useState<UserManagerSettings>()

  useEffect(() => {
    const configString = window.localStorage.getItem(authConfigKey)
    if (configString) {
      const config = JSON.parse(configString)
      setAuthConfig(config)
      setRepoUrl(config.extraQueryParams.snrepo)
    }
  }, [])

  useEffect(() => {
    async function getConfig() {
      if (!repoUrl) {
        return
      }
      try {
        const config = await getAuthConfig(repoUrl)
        setAuthConfig(config)
        window.localStorage.setItem(authConfigKey, JSON.stringify(config))
      } catch (error) {
        logger.warning({ data: error, message: `Couldn't connect to ${repoUrl}` })
        window.localStorage.removeItem(authConfigKey)
      }
    }
    getConfig()
  }, [logger, repoUrl])

  if (!authConfig || !repoUrl) {
    return (
      <Suspense fallback={<FullScreenLoader loaderText="" />}>
        <LoginPage
          isLoginDisabled={true}
          inputChangeCallback={(url) => {
            setRepoUrl(url)
          }}
        />
        <NotificationComponent />
      </Suspense>
    )
  }

  return (
    <AuthenticationProvider configuration={authConfig} history={history}>
      <RepoProvider repoUrl={repoUrl}>{children}</RepoProvider>
    </AuthenticationProvider>
  )
}

const RepoProvider = ({ children, repoUrl }: { children: ReactNode; repoUrl: string }) => {
  const { oidcUser, login } = useOidcAuthentication()
  const repo = useMemo(() => {
    if (oidcUser) {
      return new Repository({ repositoryUrl: repoUrl, token: oidcUser.access_token })
    }
  }, [oidcUser, repoUrl])

  if (!oidcUser || oidcUser.expired) {
    return (
      <Suspense fallback={<FullScreenLoader loaderText="" />}>
        <LoginPage url={repoUrl} isLoginDisabled={false} handleSubmit={login} />
        <NotificationComponent />
      </Suspense>
    )
  }

  // we will have a repository once we have oidcUser
  return <RepositoryContext.Provider value={repo!}>{children}</RepositoryContext.Provider>
}
