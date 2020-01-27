import { useLogger } from '@sensenet/hooks-react'
import React, { useEffect } from 'react'
import authService, {
  applicationPaths,
  authenticationResultStatus,
  loginActions,
  queryParameterNames,
} from '../../services/auth-service'
import { FullScreenLoader } from '../FullScreenLoader'
import { usePersonalSettings } from '../../hooks'

type Login2Props = { action: keyof typeof loginActions }

export function Login2({ action }: Login2Props) {
  const logger = useLogger('login')
  const settings = usePersonalSettings()

  useEffect(() => {
    const login = async (returnUrl: string) => {
      if (!settings.lastRepository) {
        logger.debug({ message: 'no repository found' })
        return
      }
      const state = { returnUrl }
      const result = await authService.signIn(state, settings.lastRepository)
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

    const processLoginCallback = async () => {
      if (settings.lastRepository === undefined) {
        logger.debug({ message: 'no repository found' })
        return
      }
      const result = await authService.completeSignIn(settings.lastRepository)
      switch (result.status) {
        case authenticationResultStatus.success:
          window.location.replace(`${window.location.origin}/${btoa(settings.lastRepository)}`)
          break
        case authenticationResultStatus.fail:
          logger.warning({ message: result.message })
          break
        default:
          logger.debug({ message: `Invalid authentication result status '${result}'.` })
      }
    }
    const redirectToApiAuthorizationPath = (apiAuthorizationPath: string) => {
      const redirectUrl = `${window.location.origin}${apiAuthorizationPath}`
      // It's important that we do a replace here so that when the user hits the back arrow on the
      // browser he gets sent back to where it was on the app instead of to an endpoint on this
      // component.
      window.location.replace(redirectUrl)
    }

    const redirectToRegister = () => {
      redirectToApiAuthorizationPath(
        `${applicationPaths.identityRegisterPath}?${queryParameterNames.returnUrl}=${encodeURI(
          applicationPaths.login,
        )}`,
      )
    }

    const redirectToProfile = () => {
      redirectToApiAuthorizationPath(applicationPaths.identityManagePath)
    }

    if (settings.lastRepository === undefined) {
      logger.debug({ message: 'no repository found' })
      return
    }

    switch (action) {
      case loginActions.login:
        login(`${window.location.origin}/${btoa(settings.lastRepository)}`)
        break
      case loginActions.loginCallback:
        processLoginCallback()
        break
      case loginActions.loginFailed:
        {
          const params = new URLSearchParams(window.location.search)
          const error = params.get(queryParameterNames.message)
          error && logger.warning({ message: error })
        }
        break
      case loginActions.profile:
        redirectToProfile()
        break
      case loginActions.register:
        redirectToRegister()
        break
      default:
        logger.debug({ message: `Invalid action '${action}'` })
    }
  }, [action, logger, settings.lastRepository])

  return <FullScreenLoader />
}
