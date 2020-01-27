import { useRepository } from '@sensenet/hooks-react'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import authService, {
  applicationPaths,
  authenticationResultStatus,
  logoutActions,
  queryParameterNames,
} from '../../services/auth-service'
import { useAuthenticated } from './useAuthenticatedCheck'

type LogoutProps = { action: keyof typeof logoutActions }

export function Logout({ action }: LogoutProps) {
  const [message, setMessage] = useState<string>()
  const { isReady, setIsReady, populateAuthenticationState } = useAuthenticated()
  const history = useHistory<{ local: boolean }>()
  const repo = useRepository()

  useEffect(() => {
    const logout = async (returnUrl: string) => {
      const state = { returnUrl }
      const isauthenticated = await authService.isAuthenticated(repo.configuration.repositoryUrl)
      if (isauthenticated) {
        const result = await authService.signOut(state, repo.configuration.repositoryUrl)
        switch (result.status) {
          case authenticationResultStatus.redirect:
            break
          case authenticationResultStatus.success:
            history.replace(returnUrl)
            break
          case authenticationResultStatus.fail:
            setMessage(result.message)
            break
          default:
            throw new Error('Invalid authentication result status.')
        }
      } else {
        setMessage('You successfully logged out!')
      }
    }

    const getReturnUrl = (state?: { returnUrl: string }) => {
      const params = new URLSearchParams(window.location.search)
      const fromQuery = params.get(queryParameterNames.returnUrl)
      if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
        // This is an extra check to prevent open redirects.
        throw new Error('Invalid return url. The return url needs to have the same origin as the current page.')
      }
      return state?.returnUrl || fromQuery || window.location.origin + applicationPaths.loggedOut
    }

    const processLogoutCallback = async () => {
      const url = window.location.href
      const result = await authService.completeSignOut(url, repo.configuration.repositoryUrl)
      switch (result.status) {
        case authenticationResultStatus.success:
          history.replace(getReturnUrl(result.state))
          break
        case authenticationResultStatus.fail:
          setMessage(result.message)
          break
        default:
          throw new Error('Invalid authentication result status.')
      }
    }

    switch (action) {
      case logoutActions.logout:
        if (history.location.state.local) {
          logout(getReturnUrl())
        } else {
          // This prevents regular links to <app>/authentication/logout from triggering a logout
          setIsReady(true)
          setMessage('The logout was not initiated from within the page.')
        }
        break
      case logoutActions.logoutCallback:
        processLogoutCallback()
        break
      case logoutActions.loggedOut: {
        setIsReady(true)
        setMessage('You successfully logged out!')
        break
      }
      default:
        throw new Error(`Invalid action '${action}'`)
    }

    populateAuthenticationState()
  }, [action, history, populateAuthenticationState, repo.configuration.repositoryUrl, setIsReady])

  if (!isReady) {
    return null
  }

  if (message) {
    return <div>{message}</div>
  } else {
    switch (action) {
      case logoutActions.logout:
        return <div>Processing logout</div>
      case logoutActions.logoutCallback:
        return <div>Processing logout callback</div>
      case logoutActions.loggedOut:
        return <div>{message}</div>
      default:
        throw new Error(`Invalid action '${action}'`)
    }
  }
}
