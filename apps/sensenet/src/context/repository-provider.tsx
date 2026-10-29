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
      if (!(await prepareAuthentication(authState.repoUrl))) return
      setAuthenticationCheckedFor(authState.repoUrl)
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
  }, [logger, authState.repoUrl, changeAuthType, prepareAuthentication])

  useEffect(() => {
    getConfig()
  }, [getConfig])

  if (authState.repoUrl && authenticationCheckedFor !== authState.repoUrl)
    return <FullScreenLoader loaderText="Loading authentication" />

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
      <RepoProvider repoUrl={authState.repoUrl} identityServerUrl={identityServerUrl}>
        {children}
      </RepoProvider>
    </AuthenticationProvider>
  )
}

const RepoProvider = ({
  children,
  repoUrl,
  identityServerUrl,
}: {
  children: ReactNode
  repoUrl: string
  identityServerUrl?: string
}) => {
  const { oidcUser, login, logout, error, errorOperation } = useOidcAuthentication()
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
      if (!error && (!oidcUser || oidcUser.expired) && configString) {
        try {
          await login()
        } catch (authenticationError) {
          logger.error({ data: authenticationError, message: `Couldn't authenticate with ${identityServerUrl}` })
        }
      }
    })()
  }, [logger, login, logout, oidcUser, error, identityServerUrl])

  if (error) {
    return (
      <div role="alert">
        <AuthOverrideSkeleton
          primaryText={errorOperation === 'logout' ? 'Sign-out could not be confirmed' : 'Authentication failed'}
          secondaryText={
            errorOperation === 'logout'
              ? 'The identity provider could not confirm sign-out. Return to the repository selection to continue.'
              : 'Authentication could not be completed. Return to the repository selection to try again.'
          }
          buttonText="Choose another repository"
          buttonOnClick={() => {
            clearActiveRepositorySelection()
            window.location.assign('/')
          }}
        />
      </div>
    )
  }

  if (!oidcUser || oidcUser.expired || !repo) {
    return null
  }

  return <RepositoryContext.Provider value={repo!}>{children}</RepositoryContext.Provider>
}
