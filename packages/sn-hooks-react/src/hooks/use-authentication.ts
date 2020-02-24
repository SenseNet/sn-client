import { authenticationResultStatus, AuthFuncResult, OIDCAuthenticationService } from '@sensenet/client-core'
import { useState } from 'react'
import { useLogger } from '.'

export interface AuthActionParams {
  returnUrl: string
  authService: OIDCAuthenticationService
  successCallback?: (url: string) => void
}

/**
 * useAuthentication hook helps provide helper methods for login and logout with an OIDC authentication service.
 * It **doesn't** work with forms authentication.
 */
export function useAuthentication() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const logger = useLogger('useAuthentication')

  const doAuthenticationAction = async (action: () => AuthFuncResult, successCallback?: (url: string) => void) => {
    setIsLoading(true)
    const result = await action()
    setIsLoading(false)
    switch (result.status) {
      case authenticationResultStatus.redirect:
        break
      case authenticationResultStatus.success:
        successCallback?.(result.state.returnUrl)
        break
      case authenticationResultStatus.fail:
        logger.warning({ message: result.error.message })
        setError(result.error.message)
        break
      default:
        logger.debug({ message: `Invalid status result ${result}.` })
    }
  }

  const login = async ({ authService, returnUrl, successCallback }: AuthActionParams) => {
    await doAuthenticationAction(() => authService.signIn({ returnUrl }), successCallback)
  }

  const logout = async ({ authService, returnUrl, successCallback }: AuthActionParams) => {
    await doAuthenticationAction(() => authService.signOut({ returnUrl }), successCallback)
  }

  return { login, isLoading, error, logout }
}
