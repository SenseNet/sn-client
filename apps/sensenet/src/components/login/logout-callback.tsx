import { authenticationResultStatus } from '@sensenet/client-core'
import { useLogger } from '@sensenet/hooks-react'
import React, { PropsWithChildren, useEffect } from 'react'
import { useRepository } from '../../context'
import authService from '../../services/auth-service'

export function LogoutCallback({ children }: PropsWithChildren<{}>) {
  const logger = useLogger('logout-callback')
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
          logger.error({ message: result.message })
          break
        default:
          logger.debug({ message: 'Invalid authentication result status.' })
      }
    }
    processLogoutCallback()
  }, [logger, repository])

  return <>{children}</>
}
