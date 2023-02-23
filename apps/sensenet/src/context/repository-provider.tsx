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

const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ '../components/login/login-page'))

export const authConfigKey = 'sn-oidc-config'
const customEvents = {
  onUserSignedOut: () => {
    window.localStorage.removeItem(authConfigKey)
  },
}

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const [isLoginInProgress, setIsLoginInProgress] = useState(false)
  const logger = useLogger('repository-provider')
  const globalClasses = useGlobalStyles()
  const history = useHistory()
  const [authState, setAuthState] = useState<{ repoUrl: string; config: UserManagerSettings | null }>({
    repoUrl: '',
    config: null,
  })
  const repoFromUrl = useQuery().get('repoUrl')
  const configString = window.localStorage.getItem(authConfigKey)
  const [identityServerUrl, setIdentityServerUrl] = useState()

  const clearState = useCallback(() => setAuthState({ repoUrl: '', config: null }), [])

  useEffect(() => {
    if (configString) {
      const prevAuthConfig = JSON.parse(configString)
      setIdentityServerUrl(prevAuthConfig.authority)

      if (repoFromUrl && prevAuthConfig.extraQueryParams.snrepo !== repoFromUrl) {
        return setAuthState({ repoUrl: repoFromUrl, config: null })
      }

      setAuthState((oldState) => ({
        repoUrl: prevAuthConfig?.extraQueryParams.snrepo || '',
        config: prevAuthConfig?.extraQueryParams.snrepo === oldState.repoUrl ? prevAuthConfig : null,
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
      setAuthState((oldState) => ({ ...oldState, config }))
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
      <RepoProvider repoUrl={authState.repoUrl} identityServerUrl={identityServerUrl} clearAuthState={clearState}>
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
}: {
  children: ReactNode
  repoUrl: string
  clearAuthState: Function
  identityServerUrl?: string
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
          logger.error({ data: error, message: `Couldn't connect to ${config.authority}` })
          window.localStorage.removeItem(authConfigKey)
          clearAuthState()
        }
      }
    })()
  }, [clearAuthState, logger, login, logout, oidcUser])

  if (!oidcUser || oidcUser.expired || !repo) {
    return null
  }

  return <RepositoryContext.Provider value={repo!}>{children}</RepositoryContext.Provider>
}
