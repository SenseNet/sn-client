import { CssBaseline } from '@material-ui/core'
import { UserManagerSettings } from '@sensenet/authentication-oidc-react'
import { Repository } from '@sensenet/client-core'
import { RepositoryContext, useLogger } from '@sensenet/hooks-react'
import { AuthenticationProvider, useSnAuth } from '@sensenet/sn-auth-react'
import React, { lazy, ReactNode, Suspense, useCallback, useEffect, useState } from 'react'
import { FullScreenLoader } from '../components/full-screen-loader'
import { NotificationComponent } from '../components/NotificationComponent'
import { useGlobalStyles } from '../globalStyles'
import { useQuery } from '../hooks'
import { getAuthConfig } from '../services/auth-config'

const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ '../components/login/login-page'))

export const authConfigKey = 'sn-oidc-config'

export function SnAuthRepositoryProvider({ children }: { children: React.ReactNode }) {
  const [isLoginInProgress, setIsLoginInProgress] = useState(false)
  const logger = useLogger('repository-provider')
  const globalClasses = useGlobalStyles()

  const [authState, setAuthState] = useState<{ repoUrl: string; config: UserManagerSettings | null }>({
    repoUrl: '',
    config: null,
  })
  const repoFromUrl = useQuery().get('repoUrl')
  const configString = window.localStorage.getItem(authConfigKey)
  const [authServerUrl, setAuthServerUrl] = useState()

  const clearState = useCallback(() => setAuthState({ repoUrl: '', config: null }), [])

  useEffect(() => {
    if (configString) {
      const prevAuthConfig = JSON.parse(configString)
      setAuthServerUrl(prevAuthConfig.userManagerSettings.authority)

      if (repoFromUrl && prevAuthConfig.userManagerSettings.extraQueryParams.snrepo !== repoFromUrl) {
        return setAuthState({ repoUrl: repoFromUrl, config: null })
      }

      setAuthState((oldState) => ({
        repoUrl: prevAuthConfig?.userManagerSettings.extraQueryParams.snrepo || '',
        config:
          prevAuthConfig?.userManagerSettings.extraQueryParams.snrepo === oldState.repoUrl ? prevAuthConfig : null,
      }))
    } else {
      repoFromUrl && setAuthState({ repoUrl: repoFromUrl, config: null })
    }
  }, [repoFromUrl, configString])

  const getConfig = useCallback(async () => {
    if (!authState.repoUrl) {
      setIsLoginInProgress(false)
      return
    }
    try {
      setIsLoginInProgress(true)
      const config = await getAuthConfig(authState.repoUrl)
      window.localStorage.setItem(authConfigKey, JSON.stringify(config))
      setAuthState((oldState) => ({ ...oldState, config: config.userManagerSettings }))
    } catch (error) {
      logger.warning({ data: error, message: `Couldn't connect to ${authState.repoUrl}` })
      window.localStorage.removeItem(authConfigKey)
      setAuthState((oldState) => ({ ...oldState, repoUrl: '' }))
    } finally {
      setIsLoginInProgress(false)
    }
  }, [logger, authState.repoUrl])

  useEffect(() => {
    getConfig()
  }, [getConfig])

  if (!authState.config || !authState.repoUrl) {
    return (
      <div className={globalClasses.full}>
        <CssBaseline />
        <Suspense fallback={<FullScreenLoader loaderText="Loading" />}>
          {configString || (!configString && repoFromUrl === authState.repoUrl) ? (
            <FullScreenLoader loaderText="Loading" />
          ) : (
            <LoginPage
              isLoginInProgress={isLoginInProgress}
              handleSubmit={(url) => {
                setAuthState({
                  repoUrl: url,
                  config: null,
                })
              }}
            />
          )}
          <NotificationComponent />
        </Suspense>
      </div>
    )
  }

  return (
    <AuthenticationProvider
      authServerUrl={authServerUrl!}
      repoUrl={authState.repoUrl}
      snAuthConfiguration={{
        callbackUri: '/authentication/callback',
      }}>
      <RepoProvider repoUrl={authState.repoUrl} authServerUrl={authServerUrl} clearAuthState={clearState}>
        {children}
      </RepoProvider>
    </AuthenticationProvider>
  )
}

const RepoProvider = ({
  children,
  repoUrl,
  clearAuthState,
  authServerUrl,
}: {
  children: ReactNode
  repoUrl: string
  clearAuthState: Function
  authServerUrl?: string
}) => {
  const { user, login, logout, accessToken, isLoading } = useSnAuth()
  const logger = useLogger('repo-provider')
  const [repo, setRepo] = useState<Repository>()

  useEffect(() => {
    setRepo((prevRepo) => {
      if (user && !prevRepo) {
        return new Repository({
          repositoryUrl: repoUrl,
          identityServerUrl: authServerUrl,
          token: accessToken ?? undefined,
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
      } else if (user && prevRepo) {
        prevRepo.configuration.token = accessToken ?? undefined
      }

      return prevRepo
    })
  }, [repoUrl, user, authServerUrl, accessToken])

  useEffect(() => {
    if (repo) {
      repo.reloadSchema()
    }
  }, [repo])

  useEffect(() => {
    ;(async () => {
      const configString = window.localStorage.getItem(authConfigKey)
      if (!user && !isLoading && !accessToken && configString) {
        try {
          await login()
        } catch (error) {
          const config = JSON.parse(configString)
          logger.error({ data: error, message: `Couldn't connect to ${config.authority}` })
          window.localStorage.removeItem(authConfigKey)
          clearAuthState()
        }
      }
    })()
  }, [clearAuthState, logger, login, logout, user, isLoading, accessToken])

  if (!user || !repo) {
    return null
  }

  return <RepositoryContext.Provider value={repo!}>{children}</RepositoryContext.Provider>
}
