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

export const authConfigKey = 'sn-auth-config'

export function SnAuthRepositoryProvider({
  children,
  url,
  changeAuthType,
}: {
  children: React.ReactNode
  url: string
  changeAuthType: (x: string) => void
}) {
  const [isLoginInProgress, setIsLoginInProgress] = useState(false)
  const logger = useLogger('repository-provider')
  const globalClasses = useGlobalStyles()

  const [authState, setAuthState] = useState<{ repoUrl: string; config: UserManagerSettings | null }>({
    repoUrl: '',
    config: null,
  })
  const cancelledLogin = useQuery().get('cancelledLogin')
  const [configString, setConfigString] = useState<any>()
  const [authServerUrl, setAuthServerUrl] = useState()

  const clearState = useCallback(() => setAuthState({ repoUrl: '', config: null }), [])

  useEffect(() => {
    if (cancelledLogin) {
      window.localStorage.removeItem(authConfigKey)
      setAuthState((oldState) => ({ ...oldState, repoUrl: '' }))
    } else {
      setConfigString(window.localStorage.getItem(authConfigKey))
    }
  }, [cancelledLogin])

  useEffect(() => {
    if (configString) {
      const prevAuthConfig = JSON.parse(configString)
      setAuthServerUrl(prevAuthConfig.userManagerSettings.authority)

      setAuthState((oldState) => ({
        repoUrl: prevAuthConfig?.userManagerSettings.extraQueryParams.snrepo || '',
        config:
          prevAuthConfig?.userManagerSettings.extraQueryParams.snrepo === oldState.repoUrl ? prevAuthConfig : null,
      }))
    }
  }, [configString])

  useEffect(() => {
    if (url) {
      setAuthState({ repoUrl: url, config: null })
    }
  }, [url])

  const getConfig = useCallback(async () => {
    if (!authState.repoUrl) {
      setIsLoginInProgress(false)
      return
    }
    try {
      setIsLoginInProgress(true)
      const config = await getAuthConfig(authState.repoUrl)
      if (config.authServerSettings.type === 'SNAuth') {
        window.localStorage.setItem(authConfigKey, JSON.stringify(config))
        setConfigString(window.localStorage.getItem(authConfigKey))
        setAuthState((oldState) => ({ ...oldState, config: config.userManagerSettings }))
      } else {
        changeAuthType(authState.repoUrl)
        logger.error({ message: 'Incompatible authentication server type' })
        window.localStorage.removeItem(authConfigKey)
        setAuthState((oldState) => ({ ...oldState, repoUrl: '' }))
      }
    } catch (error) {
      logger.warning({ data: error, message: `Couldn't connect to ${authState.repoUrl}` })
      window.localStorage.removeItem(authConfigKey)
      setAuthState((oldState) => ({ ...oldState, repoUrl: '' }))
    } finally {
      setIsLoginInProgress(false)
    }
  }, [logger, authState.repoUrl, changeAuthType])

  useEffect(() => {
    getConfig()
  }, [getConfig])

  if (!authState.config || !authState.repoUrl || !authServerUrl) {
    return (
      <div className={globalClasses.full}>
        <CssBaseline />
        <Suspense fallback={<FullScreenLoader loaderText="Loading" />}>
          {configString ? (
            <FullScreenLoader loaderText="Loading" />
          ) : (
            <LoginPage
              isLoginInProgress={isLoginInProgress}
              handleSubmit={(formUrl) => {
                setAuthState({
                  repoUrl: formUrl,
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
      }}
      eventCallbacks={{
        onLogout() {
          setConfigString(null)
          window.localStorage.removeItem(authConfigKey)
          clearState()
        },
      }}>
      <RepoProvider
        repoUrl={authState.repoUrl}
        authServerUrl={authServerUrl}
        clearAuthState={clearState}
        changeAuthType={changeAuthType}>
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
  changeAuthType,
}: {
  children: ReactNode
  repoUrl: string
  clearAuthState: Function
  authServerUrl?: string
  changeAuthType: (x: string) => void
}) => {
  const { user, externalLogin, logout, accessToken, isLoading } = useSnAuth()
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
      if (!user && !isLoading && !accessToken && authServerUrl && configString) {
        try {
          await externalLogin()
        } catch (error) {
          changeAuthType(repoUrl)
          logger.error({ data: error, message: `Couldn't connect to ${authServerUrl}` })
          window.localStorage.removeItem(authConfigKey)
          clearAuthState()
        }
      }
    })()
  }, [
    clearAuthState,
    logger,
    externalLogin,
    logout,
    user,
    isLoading,
    accessToken,
    authServerUrl,
    changeAuthType,
    repoUrl,
  ])

  if (!user || !repo) {
    return null
  }

  return <RepositoryContext.Provider value={repo!}>{children}</RepositoryContext.Provider>
}
