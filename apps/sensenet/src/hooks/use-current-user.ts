import { ConstantContent } from '@sensenet/client-core'
import { User } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { useEffect, useState } from 'react'
import { getAuthService } from '../services'

export function useCurrentUser() {
  const repository = useRepository()
  const logger = useLogger('use-current-user')
  const [currentUser, setCurrentUser] = useState<User>()

  useEffect(() => {
    async function getUser() {
      const authService = await getAuthService(repository.configuration.repositoryUrl)
      const user = await authService.getUser()
      if (!user) {
        logger.debug({ message: `Couldn't get user from auth service` })
        return
      }

      try {
        const result = await repository.load<User>({
          idOrPath: user.sub,
          oDataOptions: {
            select: 'all',
          },
        })
        if (result.d.Id !== ConstantContent.VISITOR_USER.Id) {
          setCurrentUser(result.d)
        }
        setCurrentUser(ConstantContent.VISITOR_USER as User)
      } catch (error) {
        logger.debug({ message: `Couldn't load current user: ${error.message}` })
        setCurrentUser(ConstantContent.VISITOR_USER as User)
      }
    }
    getUser()
  }, [logger, repository])

  return currentUser
}
