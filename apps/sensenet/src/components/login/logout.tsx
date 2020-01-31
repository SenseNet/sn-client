import { authenticationResultStatus } from '@sensenet/client-core'
import { useLogger } from '@sensenet/hooks-react'
import React, { useEffect, useState } from 'react'
import { useRepository } from '../../context'
import authService, { logoutActions } from '../../services/auth-service'
import { useAuthenticated } from './useAuthenticatedCheck'

type LogoutProps = { action: keyof typeof logoutActions }

export function Logout({ action }: LogoutProps) {
  const [message, setMessage] = useState<string>()
  const logger = useLogger('logout')
  const { isReady, setIsReady, populateAuthenticationState } = useAuthenticated()
  const { repository } = useRepository()

  useEffect(() => {
    if (!repository) {
      logger.debug({ message: 'no repository found' })
      return
    }

    const processLogoutCallback = async () => {
      const url = window.location.href
      const result = await authService.completeSignOut(url, repository.configuration.repositoryUrl)
      switch (result.status) {
        case authenticationResultStatus.success:
          window.location.replace(window.location.origin)
          break
        case authenticationResultStatus.fail:
          setMessage(result.message)
          break
        default:
          throw new Error('Invalid authentication result status.')
      }
    }

    switch (action) {
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
  }, [action, logger, populateAuthenticationState, repository, setIsReady])

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
