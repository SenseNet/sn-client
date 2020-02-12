import { authenticationResultStatus, AuthFuncResult, OIDCAuthenticationService } from '@sensenet/client-core'
import { useState } from 'react'
import { useLogger } from '.'

/**
 * useAuthentication hook helps provide helper methods for login and logout with an OIDC authentication service.
 * It **doesn't** work with forms authentication.
 */
export function useAuthentication({ authService }: { authService: OIDCAuthenticationService }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const logger = useLogger('useAuthentication')

  const doAuthenticationAction = async (action: () => AuthFuncResult, returnUrl: string) => {
    setIsLoading(true)
    const result = await action()
    setIsLoading(false)
    switch (result.status) {
      case authenticationResultStatus.redirect:
        break
      case authenticationResultStatus.success:
        window.location.replace(returnUrl)
        break
      case authenticationResultStatus.fail:
        logger.warning({ message: result.error.message })
        setError(result.error.message)
        break
      default:
        logger.debug({ message: `Invalid status result ${result}.` })
    }
  }

  const login = async (returnUrl: string, authorityUrl: string) => {
    await doAuthenticationAction(() => authService.signIn({ returnUrl, authorityUrl }), returnUrl)
  }

  const logout = async (returnUrl: string, authorityUrl: string) => {
    await doAuthenticationAction(() => authService.signOut({ returnUrl, authorityUrl }), returnUrl)
  }

  return { login, isLoading, error, logout }
}
