import { UserManagerSettings } from '@sensenet/authentication-oidc-react'
import { Repository } from '@sensenet/client-core'
import { RepositoryContext, useLogger } from '@sensenet/hooks-react'
import { AuthenticationProvider, useSnAuth } from '@sensenet/sn-auth-react'
import React, { lazy, ReactNode, Suspense, useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../application-paths'
import { useQuery } from '../hooks'

const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ '../components/login/login-page'))

export const authConfigKey = 'sn-auth-config'

export function SnAuthRepositoryProvider({ children, url }: { children: React.ReactNode; url: string }) {
  const [authState, setAuthState] = useState<{ repoUrl: string; config: UserManagerSettings | null }>({
    repoUrl: '',
    config: null,
  })
  const repoFromUrl = useQuery().get('repoUrl')
  const cancelledLogin = useQuery().get('cancelledLogin')
  const [configString, setConfigString] = useState<any>()
  const [authServerUrl, setAuthServerUrl] = useState()
  const history = useHistory()

  const clearState = useCallback(() => setAuthState({ repoUrl: '', config: null }), [])

  useEffect(() => {
    const stored = (() => {
      try {
        const item = window.localStorage.getItem('repoInfo')
        return item ? JSON.parse(item) : null
      } catch {
        return null
      }
    })()
    if (stored) {
      window.localStorage.setItem(authConfigKey, JSON.stringify(stored.config))
      setAuthState({ repoUrl: stored.url, config: stored.config.userManagerSettings })
    }
  }, [url])

  useEffect(() => {
    if (cancelledLogin) {
      window.localStorage.removeItem(authConfigKey)
      window.localStorage.removeItem('repoInfo')
      setAuthState({ config: null, repoUrl: '' })
      const u = new URL(window.location.href)
      u.searchParams.delete('cancelledLogin')
      window.location.href = u.pathname + u.search
    } else {
      setConfigString(window.localStorage.getItem(authConfigKey))
    }
  }, [cancelledLogin, history])

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

  if (!authState.config || !authState.repoUrl || !authServerUrl) {
    return <></>
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
          window.localStorage.removeItem('repoInfo')
          window.location.reload()
        },
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
  const { user, externalLogin, logout, accessToken, isLoading } = useSnAuth()
  const logger = useLogger('repo-provider')
  const [repo, setRepo] = useState<Repository>()
  const history = useHistory()

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
      const lastPath = sessionStorage.getItem('lastPath')
      history.push(lastPath ?? PATHS.landingPath.appPath)
      if (lastPath) {
        localStorage.removeItem('lastPath')
      }
    }
  }, [repo, history])

  useEffect(() => {
    ;(async () => {
      const configString = window.localStorage.getItem(authConfigKey)
      if (!user && !isLoading && !accessToken && authServerUrl && configString) {
        try {
          await externalLogin()
        } catch (error) {
          logger.error({ data: error, message: `Couldn't connect to ${authServerUrl}` })
          window.localStorage.removeItem(authConfigKey)
          clearAuthState()
        }
      }
    })()
  }, [clearAuthState, logger, externalLogin, logout, user, isLoading, accessToken, authServerUrl])

  if (!user || !repo) {
    return null
  }

  return <RepositoryContext.Provider value={repo!}>{children}</RepositoryContext.Provider>
}
