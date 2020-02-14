import { OIDCAuthenticationService, Repository } from '@sensenet/client-core'
import { OidcRoutes } from '@sensenet/hooks-react'
import React, { useEffect, useState } from 'react'
import { getAuthService, useRepoState } from '../../services'
import { applicationPaths } from '../../application-paths'

export function AuthCallback({ repoUrl }: { repoUrl: string }) {
  const [authService, setAuthService] = useState<OIDCAuthenticationService>()
  const { addRepository } = useRepoState()

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
    const accessToken = await authService.getAccessToken()
    addRepository({
      currentUser: { Name: 'Admin' } as any,
      isActive: true,
      isOnline: true,
      repository: new Repository({ repositoryUrl: repoUrl, token: accessToken }),
    })
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
