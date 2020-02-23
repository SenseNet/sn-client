import { OIDCAuthenticationService } from '@sensenet/client-core'
import { OidcRoutes, useLogger } from '@sensenet/hooks-react'
import React, { ReactNode, useEffect, useState } from 'react'
import { applicationPaths } from '../../application-paths'
import { getAuthService } from '../../services'
import { useRepoUrlFromLocalStorage } from '../../hooks'

export function AuthCallback({ children }: { children: ReactNode }) {
  const [authService, setAuthService] = useState<OIDCAuthenticationService>()
  const logger = useLogger('AuthCallback')
  const { repoUrl } = useRepoUrlFromLocalStorage()

  useEffect(() => {
    async function fetchAuthService() {
      if (!repoUrl) {
        return
      }
      const service = await getAuthService(repoUrl)
      setAuthService(service)
    }

    fetchAuthService()
  }, [repoUrl, logger])

  return (
    <>
      {authService ? (
        <OidcRoutes
          authService={authService}
          loginCallback={{
            successCallback: url => window.location.replace(url),
            url: applicationPaths.loginCallback,
            component: <div>Login callback in progress</div>,
          }}
          logoutCallback={{
            successCallback: url => {
              logger.debug({ message: `Logged out successfuly. Returning to ${url}` })
              window.location.replace(url)
            },
            failCallback: () => {
              logger.debug({ message: `logout failed` })
            },
            component: <div>Logout callback in progress</div>,
            url: applicationPaths.logOutCallback,
          }}>
          {children}
        </OidcRoutes>
      ) : (
        children
      )}
    </>
  )
}
