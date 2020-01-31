import { authenticationResultStatus, OIDCAuthenticationService } from '@sensenet/client-core'
import { useLogger } from '@sensenet/hooks-react'
import { useState } from 'react'

export function useAuthentication({ authService }: { authService: OIDCAuthenticationService }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const logger = useLogger('useAuthentication')

  const login = async (returnUrl: string, repoUrl: string) => {
    setIsLoading(true)
    const result = await authService.signIn({ returnUrl }, repoUrl)
    setIsLoading(false)
    switch (result.status) {
      case authenticationResultStatus.redirect:
        break
      case authenticationResultStatus.success:
        window.location.replace(returnUrl)
        break
      case authenticationResultStatus.fail:
        logger.warning({ message: result.message })
        break
      default:
        logger.debug({ message: `Invalid status result ${result}.` })
    }
  }

  const logout = async (returnUrl: string, repoUrl: string) => {
    setIsLoading(true)
    const isauthenticated = await authService.isAuthenticated(repoUrl)
    setIsLoading(false)
    if (isauthenticated) {
      const result = await authService.signOut({ returnUrl }, repoUrl)
      switch (result.status) {
        case authenticationResultStatus.redirect:
          break
        case authenticationResultStatus.success:
          window.location.replace(returnUrl)
          break
        case authenticationResultStatus.fail:
          setError(result.message)
          break
        default:
          logger.debug({ message: 'Invalid authentication result status.' })
      }
    }
  }

  return { login, isLoading, error, logout }
}
