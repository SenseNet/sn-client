import { CssBaseline } from '@material-ui/core'
import { AuthenticationProvider, useOidcAuthentication, UserManagerSettings } from '@sensenet/authentication-oidc-react'
import { Repository } from '@sensenet/client-core'
import { RepositoryContext, useLogger } from '@sensenet/hooks-react'
import React, { lazy, ReactNode, Suspense, useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FullScreenLoader } from '../components/full-screen-loader'
import { AuthOverrideSkeleton } from '../components/login/auth-override-skeleton'
import { NotAuthenticatedOverride } from '../components/login/not-authenticated-override'
import { SessionLostOverride } from '../components/login/session-lost-override'
import { NotificationComponent } from '../components/NotificationComponent'
import { useGlobalStyles } from '../globalStyles'
import { useQuery } from '../hooks'
import { getAuthConfig } from '../services/auth-config'
import {
  clearActiveRepositorySelection,
  normalizeRepositoryUrl,
  oidcAuthConfigKey,
} from '../services/repository-session'

const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ '../components/login/login-page'))

export const authConfigKey = oidcAuthConfigKey
const customEvents = {
  onUserSignedOut: () => {
    clearActiveRepositorySelection()
  },
}

export function RepositoryProvider({
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
  const history = useHistory()
  const [authState, setAuthState] = useState<{ repoUrl: string; config: UserManagerSettings | null }>({
    repoUrl: '',
    config: null,
  })
  const configString = window.localStorage.getItem(authConfigKey)
  const [identityServerUrl, setIdentityServerUrl] = useState()

  const clearState = useCallback(() => setAuthState({ repoUrl: '', config: null }), [])

  useEffect(() => {
    if (configString) {
      const prevAuthConfig = JSON.parse(configString)
      setIdentityServerUrl(prevAuthConfig.authority)

      // Access extraQueryParams via userManagerSettings
      const extraQueryParams = prevAuthConfig.userManagerSettings?.extraQueryParams

      setAuthState((oldState) => ({
        repoUrl: extraQueryParams?.snrepo || '',
        config: extraQueryParams?.snrepo === oldState.repoUrl ? prevAuthConfig.userManagerSettings : null,
      }))
    }
  }, [configString])

  useEffect(() => {
    if (url) {
      setAuthState({ repoUrl: normalizeRepositoryUrl(url), config: null })
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
      if (config.authServerSettings.type !== 'IdentityServer') {
        changeAuthType(authState.repoUrl)
        logger.error({ message: 'Incompatible authentication server type' })
        clearActiveRepositorySelection()
        setAuthState((oldState) => ({ ...oldState, repoUrl: '' }))
        return
      }

      window.localStorage.setItem(authConfigKey, JSON.stringify(config))
      // Set only userManagerSettings in authState to match the expected type
      setAuthState((oldState) => ({ ...oldState, config: config.userManagerSettings }))
    } catch (error) {
      logger.warning({ data: error, message: `Couldn't connect to ${authState.repoUrl}` })
      clearActiveRepositorySelection()
      setAuthState((oldState) => ({ ...oldState, repoUrl: '' }))
    } finally {
      setIsLoginInProgress(false)
    }
  }, [logger, authState.repoUrl, changeAuthType])

  useEffect(() => {
    getConfig()
  }, [getConfig])

  if (!authState.config || !authState.repoUrl) {
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
      configuration={authState.config}
      history={history}
      authenticating={() => (
        <AuthOverrideSkeleton
          primaryText="Authentication is in progress"
          secondaryText="You will be redirected to the login page"
        />
      )}
      notAuthenticated={() => <NotAuthenticatedOverride clearState={clearState} />}
      notAuthorized={() => (
        <AuthOverrideSkeleton
          primaryText="Authorization"
          secondaryText="You are not authorized to access this resource."
        />
      )}
      sessionLost={(props) => {
        return <SessionLostOverride onAuthenticate={props.onAuthenticate} />
      }}
      callbackComponentOverride={() => (
        <AuthOverrideSkeleton
          primaryText="Authentication complete"
          secondaryText="You will be redirected to your application."
        />
      )}
      customEvents={customEvents}>
      <RepoProvider
        repoUrl={authState.repoUrl}
        identityServerUrl={identityServerUrl}
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
  identityServerUrl,
  changeAuthType,
}: {
  children: ReactNode
  repoUrl: string
  clearAuthState: Function
  identityServerUrl?: string
  changeAuthType: (x: string) => void
}) => {
  const { oidcUser, login, logout } = useOidcAuthentication()
  const logger = useLogger('repo-provider')
  const [repo, setRepo] = useState<Repository>()

  useEffect(() => {
    setRepo((prevRepo) => {
      if (oidcUser && !prevRepo) {
        return new Repository({
          repositoryUrl: repoUrl,
          identityServerUrl,
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
      } else if (oidcUser && prevRepo) {
        prevRepo.configuration.token = oidcUser?.access_token
      }

      return prevRepo
    })
  }, [repoUrl, oidcUser, identityServerUrl])

  useEffect(() => {
    if (repo) {
      repo.reloadSchema()
    }
  }, [repo])

  useEffect(() => {
    ;(async () => {
      const configString = window.localStorage.getItem(authConfigKey)
      if ((!oidcUser || oidcUser.expired) && configString) {
        try {
          await login()
        } catch (error) {
          const config = JSON.parse(configString)
          changeAuthType(repoUrl)
          logger.error({ data: error, message: `Couldn't connect to ${config.authority}` })
          clearActiveRepositorySelection()
          clearAuthState()
        }
      }
    })()
  }, [clearAuthState, logger, login, logout, oidcUser, changeAuthType, repoUrl])

  if (!oidcUser || oidcUser.expired || !repo) {
    return null
  }

  return <RepositoryContext.Provider value={repo!}>{children}</RepositoryContext.Provider>
}
