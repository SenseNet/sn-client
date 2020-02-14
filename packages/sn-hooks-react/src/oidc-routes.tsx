import { authenticationResultStatus, AuthFuncResult, OIDCAuthenticationService } from '@sensenet/client-core'
import React, { ReactNode, useEffect, useState } from 'react'
import { useLogger } from '.'

interface Callback {
  url?: string
  successCallback?: (returnUrl: string) => void
  component?: ReactNode
}

type OidcRoutesProps = {
  loginCallback?: Callback
  logoutCallback?: Callback
  authService: OIDCAuthenticationService
}

/**
 * This component will act as a router without any router implementation.
 * It will call the completeSignIn/completeSignOut once the window location is at {loginCallback.url | logoutCallback.url}
 */
export function OidcRoutes({
  loginCallback = { url: `/authentication/login-callback` },
  logoutCallback = { url: `/authentication/logout-callback` },
  authService,
}: OidcRoutesProps) {
  const [path, setPath] = useState(window.location.pathname)
  const logger = useLogger('oidcRoutes')

  useEffect(() => {
    const processCallback = async (callBack: () => AuthFuncResult, successCallback?: (returnUrl: string) => void) => {
      const result = await callBack()

      switch (result.status) {
        case authenticationResultStatus.success:
          successCallback?.(result.state.returnUrl)
          break
        case authenticationResultStatus.fail:
          logger.warning({ message: result.error.message })
          break
        default:
          logger.debug({ message: `Invalid authentication result status '${result}'.` })
      }
    }

    const setNewPath = () => {
      const params = new URLSearchParams(window.location.search)
      const error = params.get('error')
      if (error) {
        logger.warning({ message: error })
        window.location.replace(window.location.origin)
        return
      }
      setPath(window.location.pathname)
      switch (path) {
        case loginCallback.url:
          processCallback(() => authService.completeSignIn(), loginCallback.successCallback)
          break
        case logoutCallback.url:
          processCallback(() => authService.completeSignOut(), logoutCallback.successCallback)
          break
        default:
          break
      }
    }
    setNewPath()
    window.addEventListener('popstate', setNewPath, false)
    return () => window.removeEventListener('popstate', setNewPath, false)
  }, [authService, logger, loginCallback, logoutCallback, path])

  switch (path) {
    case loginCallback.url:
      return <>{loginCallback.component}</>
    case logoutCallback.url:
      return <>{logoutCallback.component}</>
    default:
      return null
  }
}
