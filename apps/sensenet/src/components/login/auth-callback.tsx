import { OIDCAuthenticationService } from '@sensenet/client-core'
import { OidcRoutes, useLogger } from '@sensenet/hooks-react'
import React, { useEffect, useState } from 'react'
import { applicationPaths } from '../../application-paths'
import { getAuthService } from '../../services'
import { useRepoUrlFromLocalStorage } from '../../hooks'

export function AuthCallback() {
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
          loginCallback={{ successCallback: url => window.location.replace(url), url: applicationPaths.loginCallback }}
          logoutCallback={{
            successCallback: url => {
              logger.debug({ message: `Logged out successfuly. Returning to ${url}` })
              window.location.replace(url)
            },
            url: applicationPaths.logOutCallback,
          }}
        />
      ) : null}
    </>
  )
}
