import { CssBaseline } from '@material-ui/core'
import { UserManagerSettings } from '@sensenet/authentication-oidc-react'
import { Repository } from '@sensenet/client-core'
import { RepositoryContext, useLogger } from '@sensenet/hooks-react'
import { AuthenticationProvider, getPendingExternalLoginTarget, useSnAuth } from '@sensenet/sn-auth-react'
import React, { lazy, ReactNode, Suspense, useCallback, useEffect, useState } from 'react'
import { FullScreenLoader } from '../components/full-screen-loader'
import { AuthOverrideSkeleton } from '../components/login/auth-override-skeleton'
import { NotificationComponent } from '../components/NotificationComponent'
import { useGlobalStyles } from '../globalStyles'
import { useQuery } from '../hooks'
import { getAuthConfig } from '../services/auth-config'
import {
  clearActiveRepositorySelection,
  consumeSnAuthRepositoryLogin,
  getSelectedSnAuthRepository,
  getSnAuthRepositoryConfig,
  getSnAuthRepositorySessions,
  getSnAuthStorageKeyPrefix,
  hasPendingSnAuthRepositoryLogin,
  migrateLegacySnAuthTokens,
  normalizeRepositoryUrl,
  removeSnAuthRepositorySession,
  setSelectedSnAuthRepository,
  setSnAuthRepositoryConfig,
  snAuthConfigKey,
  startSnAuthRepositoryLogin,
  upsertSnAuthRepositorySession,
} from '../services/repository-session'

const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ '../components/login/login-page'))

export const authConfigKey = snAuthConfigKey
const callbackUri = '/authentication/callback'

export function SnAuthRepositoryProvider({
  children,
  url,
  changeAuthType,
  prepareAuthentication,
}: {
  children: React.ReactNode
  url: string
  changeAuthType: (x: string) => void
  prepareAuthentication: (repoUrl: string) => Promise<boolean>
}) {
  const [isLoginInProgress, setIsLoginInProgress] = useState(false)
  const [authenticationCheckedFor, setAuthenticationCheckedFor] = useState('')
  const logger = useLogger('repository-provider')
  const globalClasses = useGlobalStyles()

  const [authState, setAuthState] = useState<{ repoUrl: string; config: UserManagerSettings | null }>({
    repoUrl: '',
    config: null,
  })
  const cancelledLogin = useQuery().get('cancelledLogin')
  const [configString, setConfigString] = useState<any>()
  const [authServerUrl, setAuthServerUrl] = useState<string>()
  const [callbackEntry] = useState(() => {
    if (window.location.pathname !== callbackUri) return undefined
    const target = getPendingExternalLoginTarget(callbackUri, new URLSearchParams(window.location.search).get('state'))
    let config
    try {
      config = target && getSnAuthRepositoryConfig(target.repoUrl)
    } catch {
      return { config: undefined }
    }
    const settings = config?.userManagerSettings
    if (
      target &&
      config?.authServerSettings?.type === 'SNAuth' &&
      normalizeRepositoryUrl(settings?.extraQueryParams?.snrepo || '') === normalizeRepositoryUrl(target.repoUrl) &&
      normalizeRepositoryUrl(settings?.authority || '') === normalizeRepositoryUrl(target.authServerUrl)
    )
      return { config }
    return { config: undefined }
  })
  const [callbackError, setCallbackError] = useState(
    callbackEntry && !callbackEntry.config
      ? 'The sign-in response does not match an active login. Start sign-in again.'
      : undefined,
  )

  const clearState = useCallback(() => setAuthState({ repoUrl: '', config: null }), [])
  const returnToRepositorySelection = useCallback(() => {
    setCallbackError(undefined)
    window.history.replaceState({}, '', '/')
    setConfigString(null)
    clearActiveRepositorySelection()
    clearState()
  }, [clearState])

  useEffect(() => {
    if (cancelledLogin) {
      clearActiveRepositorySelection()
      setAuthState((oldState) => ({ ...oldState, repoUrl: '' }))
    } else if (callbackEntry) {
      if (callbackEntry.config) {
        window.localStorage.setItem('authType', 'SNAuth')
        setConfigString(JSON.stringify(callbackEntry.config))
      }
    } else {
      const selectedRepository = getSelectedSnAuthRepository()
      const selectedConfig = selectedRepository && getSnAuthRepositoryConfig(selectedRepository)
      setConfigString(selectedConfig ? JSON.stringify(selectedConfig) : window.localStorage.getItem(authConfigKey))
    }
  }, [cancelledLogin])

  useEffect(() => {
    if (configString) {
      const prevAuthConfig = JSON.parse(configString)
      const repoUrl = normalizeRepositoryUrl(prevAuthConfig?.userManagerSettings.extraQueryParams.snrepo || '')
      setAuthServerUrl(prevAuthConfig.userManagerSettings.authority)
      setSelectedSnAuthRepository(repoUrl)
      migrateLegacySnAuthTokens(repoUrl)

      setAuthState((oldState) => ({
        repoUrl,
        config:
          repoUrl === oldState.repoUrl || !oldState.repoUrl ? prevAuthConfig.userManagerSettings : oldState.config,
      }))
    }
  }, [configString])

  useEffect(() => {
    if (callbackEntry && window.location.pathname === callbackUri) return
    if (url) {
      const repoUrl = normalizeRepositoryUrl(url)
      const storedConfig = getSnAuthRepositoryConfig(repoUrl)

      setSelectedSnAuthRepository(repoUrl)
      setAuthServerUrl(storedConfig?.userManagerSettings.authority)
      setAuthState({ repoUrl, config: storedConfig?.userManagerSettings ?? null })
      setConfigString(storedConfig ? JSON.stringify(storedConfig) : null)
    }
  }, [url])

  const getConfig = useCallback(async () => {
    if (!authState.repoUrl) {
      setIsLoginInProgress(false)
      return
    }
    try {
      setIsLoginInProgress(true)
      const boundCallback = window.location.pathname === callbackUri && callbackEntry?.config
      if (!boundCallback && !(await prepareAuthentication(authState.repoUrl))) return
      setAuthenticationCheckedFor(authState.repoUrl)
      const storedConfig = boundCallback || getSnAuthRepositoryConfig(authState.repoUrl)

      if (storedConfig) {
        setAuthServerUrl(storedConfig.userManagerSettings.authority)
        window.localStorage.setItem(authConfigKey, JSON.stringify(storedConfig))
        setAuthState((oldState) => ({ ...oldState, config: storedConfig.userManagerSettings }))
        return
      }

      const config = await getAuthConfig(authState.repoUrl)
      if (config.authServerSettings.type === 'SNAuth') {
        setSnAuthRepositoryConfig(authState.repoUrl, config)
        setConfigString(window.localStorage.getItem(authConfigKey))
        setAuthState((oldState) => ({ ...oldState, config: config.userManagerSettings }))
      } else {
        changeAuthType(authState.repoUrl)
        logger.error({ message: 'Incompatible authentication server type' })
        clearActiveRepositorySelection()
        setAuthState((oldState) => ({ ...oldState, repoUrl: '' }))
      }
    } catch (error) {
      logger.warning({ data: error, message: `Couldn't connect to ${authState.repoUrl}` })
      clearActiveRepositorySelection()
      setAuthState((oldState) => ({ ...oldState, repoUrl: '' }))
    } finally {
      setIsLoginInProgress(false)
    }
  }, [logger, authState.repoUrl, changeAuthType, prepareAuthentication])

  useEffect(() => {
    getConfig()
  }, [getConfig])

  if (callbackError) {
    return (
      <div role="alert">
        <AuthOverrideSkeleton
          primaryText="Authentication failed"
          secondaryText={callbackError}
          buttonText="Choose another repository"
          buttonOnClick={returnToRepositorySelection}
        />
      </div>
    )
  }

  if (authState.repoUrl && authenticationCheckedFor !== authState.repoUrl)
    return <FullScreenLoader loaderText="Loading authentication" />

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
              repositoryOptions={getSnAuthRepositorySessions()}
              handleSelectRepository={(repoUrl) => {
                startSnAuthRepositoryLogin(repoUrl)
                setAuthState({
                  repoUrl: normalizeRepositoryUrl(repoUrl),
                  config: null,
                })
              }}
              handleSubmit={(formUrl) => {
                startSnAuthRepositoryLogin(formUrl)
                setAuthState({
                  repoUrl: normalizeRepositoryUrl(formUrl),
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
      key={getSnAuthStorageKeyPrefix(authState.repoUrl)}
      storageKeyPrefix={getSnAuthStorageKeyPrefix(authState.repoUrl)}
      snAuthConfiguration={{
        callbackUri,
      }}
      eventCallbacks={{
        onNoInitialization() {
          if (!hasPendingSnAuthRepositoryLogin(authState.repoUrl)) {
            setConfigString(null)
            clearActiveRepositorySelection()
            clearState()
          }
        },
        onLogout() {
          setConfigString(null)
          removeSnAuthRepositorySession(authState.repoUrl)
          clearActiveRepositorySelection()
          clearState()
        },
        onLogoutError(error) {
          logger.warning({ data: error, message: 'Signed out locally. Server revocation could not be confirmed.' })
        },
      }}>
      <RepoProvider
        repoUrl={authState.repoUrl}
        authServerUrl={authServerUrl}
        clearAuthState={returnToRepositorySelection}
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
  const { user, externalLogin, logout, accessToken, error, isLoading } = useSnAuth()
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
    if (user && accessToken && authServerUrl) {
      upsertSnAuthRepositorySession(repoUrl, authServerUrl)
    }
  }, [accessToken, authServerUrl, repoUrl, user])

  useEffect(() => {
    if (repo) {
      repo.reloadSchema()
    }
  }, [repo])

  useEffect(() => {
    ;(async () => {
      const configString = window.localStorage.getItem(authConfigKey)
      if (error && !user && !isLoading) return

      if (!user && !isLoading && !accessToken && authServerUrl && configString) {
        if (!consumeSnAuthRepositoryLogin(repoUrl)) {
          return
        }

        try {
          await externalLogin()
        } catch (externalLoginError) {
          logger.error({ data: externalLoginError, message: `Couldn't connect to ${authServerUrl}` })
        }
      }
    })()
  }, [
    clearAuthState,
    logger,
    externalLogin,
    logout,
    error,
    user,
    isLoading,
    accessToken,
    authServerUrl,
    changeAuthType,
    repoUrl,
  ])

  if (error && !user && !isLoading) {
    return (
      <div role="alert">
        <AuthOverrideSkeleton
          primaryText="Authentication failed"
          secondaryText={error}
          buttonText="Choose another repository"
          buttonOnClick={() => clearAuthState()}
        />
      </div>
    )
  }

  if (!user || !repo) {
    return null
  }

  return <RepositoryContext.Provider value={repo!}>{children}</RepositoryContext.Provider>
}
