import { useLogger } from '@sensenet/hooks-react'
import { authenticationResultStatus } from '@sensenet/client-core'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import authService, { applicationPaths, loginActions, queryParameterNames } from '../../services/auth-service'
import { FullScreenLoader } from '../FullScreenLoader'
import { usePersonalSettings } from '../../hooks'

type Login2Props = { action: keyof typeof loginActions }

export function Login2({ action }: Login2Props) {
  const logger = useLogger('login')
  const history = useHistory<{ repositoryUrl: string }>()
  const settings = usePersonalSettings()

  useEffect(() => {
    const getRepoUrl = () => {
      if (history.location.state?.repositoryUrl) {
        return history.location.state.repositoryUrl
      }
      return settings.lastRepository
    }

    const repoUrl = getRepoUrl()
    if (!repoUrl) {
      logger.debug({ message: 'no repository found' })
      return
    }

    const login = async (returnUrl: string) => {
      const state = { returnUrl }
      const result = await authService.signIn(state, repoUrl)
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
      const result = await authService.completeSignIn(repoUrl)
      switch (result.status) {
        case authenticationResultStatus.success:
          window.location.replace(`${window.location.origin}/${btoa(repoUrl)}`)
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
    switch (action) {
      case loginActions.login:
        login(`${window.location.origin}/${btoa(repoUrl)}`)
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
  }, [action, history.location.state, logger, settings.lastRepository])

  return <FullScreenLoader />
}
