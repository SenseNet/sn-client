import { OIDCAuthenticationService } from '@sensenet/client-core'
import { OidcRoutes } from '@sensenet/hooks-react'
import React, { useEffect, useState } from 'react'
import { applicationPaths } from '../../application-paths'
import { getAuthService } from '../../services'
import { useRepoUrlFromLocalStorage } from '../../hooks'

export function AuthCallback({ repoUrl }: { repoUrl: string }) {
  const [authService, setAuthService] = useState<OIDCAuthenticationService>()
  const { setRepoUrl } = useRepoUrlFromLocalStorage()

  useEffect(() => {
    async function fetchAuthService() {
      const service = await getAuthService(repoUrl)
      setAuthService(service)
    }
    fetchAuthService()
  }, [repoUrl])

  const loginSuccessCallback = async (returnUrl: string) => {
    if (!authService) {
      console.log('no auth service available')
      return
    }
    setRepoUrl(repoUrl)
    window.location.replace(returnUrl)
  }

  return (
    <>
      {authService ? (
        <OidcRoutes
          authService={authService}
          loginCallback={{ successCallback: loginSuccessCallback, url: applicationPaths.loginCallback }}
          logoutCallback={{
            successCallback: url => window.location.replace(url),
            url: applicationPaths.logOutCallback,
          }}
        />
      ) : null}
    </>
  )
}
