import { authenticationResultStatus, AuthFuncResult, OIDCAuthenticationService } from '@sensenet/client-core'
import React, { ReactNode, useEffect, useState } from 'react'
import { useLogger } from '.'

interface Callback {
  url?: string
  successCallback?: (returnUrl: string) => void
  failCallback?: (errorMessage: string) => void
  component?: ReactNode
}

type OidcRoutesProps = {
  loginCallback?: Callback
  logoutCallback?: Callback
  authService: OIDCAuthenticationService
  children: ReactNode
}

/**
 * This component will act as a router without any router implementation.
 * It will call the completeSignIn/completeSignOut once the window location is at {loginCallback.url | logoutCallback.url}
 */
export function OidcRoutes({
  loginCallback = { url: `/authentication/login-callback` },
  logoutCallback = { url: `/authentication/logout-callback` },
  authService,
  children,
}: OidcRoutesProps) {
  const [path, setPath] = useState(window.location.pathname)
  const logger = useLogger('oidcRoutes')

  useEffect(() => {
    const processCallback = async (
      options: {
        authAction: () => AuthFuncResult
      } & Pick<Callback, 'successCallback' | 'failCallback'>,
    ) => {
      const result = await options.authAction()

      switch (result.status) {
        case authenticationResultStatus.success:
          options.successCallback?.(result.state?.returnUrl)
          break
        case authenticationResultStatus.fail:
          options.failCallback?.(result.error.message)
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
          processCallback({ authAction: () => authService.completeSignIn(), ...loginCallback })
          break
        case logoutCallback.url:
          processCallback({ authAction: () => authService.completeSignOut(), ...logoutCallback })
          break
        default:
          break
      }
    }
    setNewPath()
  }, [authService, logger, loginCallback, logoutCallback, path])

  switch (path) {
    case loginCallback.url:
      return <>{loginCallback.component ?? null}</>
    case logoutCallback.url:
      return <>{logoutCallback.component ?? null}</>
    default:
      return <>{children}</>
  }
}
