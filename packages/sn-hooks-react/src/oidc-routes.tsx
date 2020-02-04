import { authenticationResultStatus, OIDCAuthenticationService } from '@sensenet/client-core'
import React, { ReactNode, useEffect, useState } from 'react'
import { useLogger } from '.'

type OidcRoutesProps = {
  loginCallback?: {
    url?: string
    successRedirectUrl?: string
    component?: ReactNode
  }
  logoutCallback?: {
    url?: string
    successRedirectUrl?: string
    component?: ReactNode
  }
  repoUrl: string
  authService: OIDCAuthenticationService
}

type completeCallbackResult = Promise<
  | {
      status: 'success'
      state: {
        returnUrl: string
      }
    }
  | {
      status: 'fail'
      message: string
    }
>

/**
 * This component will act as a router without any router implementation.
 * It will call the completeSignIn/completeSignOut once the window location is at {loginCallback.url | logoutCallback.url}
 */
export function OidcRoutes({ loginCallback, logoutCallback, authService, repoUrl }: OidcRoutesProps) {
  const [path, setPath] = useState(window.location.pathname)
  const logger = useLogger('oidcRoutes')

  useEffect(() => {
    const processCallback = async (
      callBack: (repoUrl: string) => completeCallbackResult,
      successRedirectUrl?: string,
    ) => {
      if (!repoUrl) {
        logger.debug({ message: 'no repository url found' })
        return
      }

      const result = await callBack(repoUrl)
      switch (result.status) {
        case authenticationResultStatus.success:
          window.location.replace(successRedirectUrl ?? window.location.origin)
          break
        case authenticationResultStatus.fail:
          logger.warning({ message: result.message })
          break
        default:
          logger.debug({ message: `Invalid authentication result status '${result}'.` })
      }
    }

    const setNewPath = () => {
      setPath(window.location.pathname)
      switch (path) {
        case loginCallback?.url:
          processCallback(authorityUrl => authService.completeSignIn(authorityUrl), loginCallback?.successRedirectUrl)
          break
        case logoutCallback?.url:
          processCallback(authorityUrl => authService.completeSignOut(authorityUrl), logoutCallback?.successRedirectUrl)
          break
        default:
          break
      }
    }
    setNewPath()
    window.addEventListener('popstate', setNewPath, false)
    return () => window.removeEventListener('popstate', setNewPath, false)
  }, [authService, logger, loginCallback, logoutCallback, path, repoUrl])

  switch (path) {
    case loginCallback?.url:
      return <>{loginCallback?.component}</>
    case logoutCallback?.url:
      return <>{logoutCallback?.component}</>
    default:
      return null
  }
}
