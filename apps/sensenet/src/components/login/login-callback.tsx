import { authenticationResultStatus } from '@sensenet/client-core'
import { useLogger } from '@sensenet/hooks-react'
import React, { useEffect } from 'react'
import { usePersonalSettings } from '../../hooks'
import authService from '../../services/auth-service'
import { FullScreenLoader } from '../FullScreenLoader'

export function LoginCallback() {
  const logger = useLogger('loginCallback')
  const settings = usePersonalSettings()

  useEffect(() => {
    const processLoginCallback = async () => {
      if (!settings.lastRepository) {
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

    processLoginCallback()
  }, [logger, settings.lastRepository])

  return <FullScreenLoader />
}
