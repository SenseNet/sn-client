import { CssBaseline } from '@material-ui/core'
import { AuthenticationProvider, useOidcAuthentication, UserManagerSettings } from '@sensenet/authentication-oidc-react'
import { Repository } from '@sensenet/client-core'
import { RepositoryContext, useLogger } from '@sensenet/hooks-react'
import React, { lazy, ReactNode, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FullScreenLoader } from '../components/full-screen-loader'
import NotAuthenticated from '../components/not-authenticated'
import { NotificationComponent } from '../components/NotificationComponent'
import { useGlobalStyles } from '../globalStyles'
import { getAuthConfig } from '../services/auth-config'

const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ '../components/login/login-page'))

export const authConfigKey = 'sn-oidc-config'

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const [repoUrl, setRepoUrl] = useState<string>()
  const [isLoginInProgress, setIsLoginInProgress] = useState(false)
  const logger = useLogger('repository-provider')
  const globalClasses = useGlobalStyles()
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

  const getConfig = useCallback(async () => {
    if (!repoUrl) {
      setIsLoginInProgress(false)
      return
    }
    try {
      setIsLoginInProgress(true)
      const config = await getAuthConfig(repoUrl)
      setAuthConfig(config)
      window.localStorage.setItem(authConfigKey, JSON.stringify(config))
    } catch (error) {
      logger.warning({ data: error, message: `Couldn't connect to ${repoUrl}` })
      window.localStorage.removeItem(authConfigKey)
    } finally {
      setIsLoginInProgress(false)
    }
  }, [logger, repoUrl])

  useEffect(() => {
    getConfig()
  }, [getConfig])

  if (!authConfig || !repoUrl) {
    return (
      <div className={globalClasses.full}>
        <CssBaseline />
        <Suspense fallback={<FullScreenLoader loaderText="Loading" />}>
          <LoginPage
            isLoginInProgress={isLoginInProgress}
            handleSubmit={(url) => {
              setRepoUrl(url)
              getConfig()
            }}
          />
          <NotificationComponent />
        </Suspense>
      </div>
    )
  }

  return (
    <AuthenticationProvider
      configuration={authConfig}
      history={history}
      notAuthenticated={<NotAuthenticated />}
      customEvents={{
        onUserSignedOut: () => {
          window.localStorage.removeItem(authConfigKey)
        },
      }}>
      <RepoProvider repoUrl={repoUrl}>{children}</RepoProvider>
    </AuthenticationProvider>
  )
}

const RepoProvider = ({ children, repoUrl }: { children: ReactNode; repoUrl: string }) => {
  const { oidcUser, login } = useOidcAuthentication()
  const repo = useMemo(() => {
    if (oidcUser) {
      return new Repository({
        repositoryUrl: repoUrl,
        token: oidcUser.access_token,
        requiredSelect: [
          'Id',
          'Path',
          'Name',
          'Type',
          'DisplayName',
          'Icon',
          'IsFile',
          'IsFolder',
          'ParentId',
          'Version',
          'PageCount',
          'Binary',
          'CreationDate',
          'Avatar',
        ],
      })
    }
  }, [oidcUser, repoUrl])

  useEffect(() => {
    if (repo) {
      repo.reloadSchema()
    }
  }, [repo])

  useEffect(() => {
    const configString = window.localStorage.getItem(authConfigKey)
    if ((!oidcUser || oidcUser.expired) && configString) {
      login()
    }
  }, [login, oidcUser])

  if (!oidcUser || oidcUser.expired) {
    return null
  }

  // we will have a repository once we have oidcUser
  return <RepositoryContext.Provider value={repo!}>{children}</RepositoryContext.Provider>
}
