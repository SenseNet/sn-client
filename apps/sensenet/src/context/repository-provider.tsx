import { AuthenticationProvider, useOidcAuthentication, UserManagerSettings } from '@sensenet/authentication-oidc-react'
import { Repository } from '@sensenet/client-core'
import { RepositoryContext, useLogger } from '@sensenet/hooks-react'
import { CssBaseline } from '@material-ui/core'
import React, { lazy, ReactNode, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FullScreenLoader } from '../components/full-screen-loader'
import { AuthOverrideSkeleton } from '../components/login/auth-override-skeleton'
import { NotAuthenticatedOverride } from '../components/login/not-authenticated-override'
import { SessionLostOverride } from '../components/login/session-lost-override'
import { NotificationComponent } from '../components/NotificationComponent'
import { useGlobalStyles } from '../globalStyles'
import { useQuery } from '../hooks/use-query'
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

  const clearState = useCallback(() => setAuthState({ repoUrl: '', config: null }), [])

  useEffect(() => {
    if (configString) {
      const prevAuthConfig = JSON.parse(configString)
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
      authenticating={
        <AuthOverrideSkeleton
          primaryText="Authentication is in progress"
          secondaryText="You will be redirected to the login page"
        />
      }
      notAuthenticated={<NotAuthenticatedOverride clearState={clearState} />}
      notAuthorized={
        <AuthOverrideSkeleton
          primaryText="Authorization"
          secondaryText="You are not authorized to access this resource."
        />
      }
      sessionLost={(props) => {
        return <SessionLostOverride onAuthenticate={props.onAuthenticate} />
      }}
      callbackComponentOverride={
        <AuthOverrideSkeleton
          primaryText="Authentication complete"
          secondaryText="You will be redirected to your application."
        />
      }
      customEvents={customEvents}>
      <RepoProvider repoUrl={authState.repoUrl}>{children}</RepoProvider>
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
