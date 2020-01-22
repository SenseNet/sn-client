import { useRepository } from '@sensenet/hooks-react'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import authService, {
  applicationPaths,
  authenticationResultStatus,
  loginActions,
  queryParameterNames,
} from '../../services/auth-service'

type Login2Props = { action: keyof typeof loginActions }

export function Login2({ action }: Login2Props) {
  const [message, setMessage] = useState<string>()
  const history = useHistory()
  const repository = useRepository()

  useEffect(() => {
    const login = async (returnUrl: string) => {
      const state = { returnUrl }
      const result = await authService.signIn(state, repository.configuration.repositoryUrl)
      switch (result.status) {
        case authenticationResultStatus.redirect:
          break
        case authenticationResultStatus.success:
          history.push(returnUrl)
          break
        case authenticationResultStatus.fail:
          setMessage(result.message)
          break
        default:
          throw new Error(`Invalid status result ${result}.`)
      }
    }

    const getReturnUrl = (state?: { returnUrl: string }) => {
      const params = new URLSearchParams(window.location.search)
      const fromQuery = params.get(queryParameterNames.returnUrl)
      if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
        // This is an extra check to prevent open redirects.
        throw new Error('Invalid return url. The return url needs to have the same origin as the current page.')
      }
      return state?.returnUrl || fromQuery || `${window.location.origin}/`
    }

    const processLoginCallback = async () => {
      const result = await authService.completeSignIn(repository.configuration.repositoryUrl, window.location.href)
      switch (result.status) {
        case authenticationResultStatus.success:
          history.push(getReturnUrl(result.state))
          break
        case authenticationResultStatus.fail:
          setMessage(result.message)
          break
        default:
          throw new Error(`Invalid authentication result status '${result}'.`)
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
        login(getReturnUrl())
        break
      case loginActions.loginCallback:
        processLoginCallback()
        break
      case loginActions.loginFailed:
        {
          const params = new URLSearchParams(window.location.search)
          const error = params.get(queryParameterNames.message)
          error && setMessage(error)
        }
        break
      case loginActions.profile:
        redirectToProfile()
        break
      case loginActions.register:
        redirectToRegister()
        break
      default:
        throw new Error(`Invalid action '${action}'`)
    }
  }, [action, history, repository.configuration.repositoryUrl])

  if (!message) {
    return <div>{message}</div>
  } else {
    switch (action) {
      case loginActions.login:
        return <div>Processing login</div>
      case loginActions.loginCallback:
        return <div>Processing login callback</div>
      case loginActions.profile:
      case loginActions.register:
        return <div />
      default:
        throw new Error(`Invalid action '${action}'`)
    }
  }
}
