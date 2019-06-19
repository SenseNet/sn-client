import { ConstantContent, LoginState } from '@sensenet/client-core'
import { isExtendedError } from '@sensenet/client-core/dist/Repository/Repository'
import { Group, User } from '@sensenet/default-content-types'
import React, { useEffect, useState } from 'react'
import Semaphore from 'semaphore-async-await'
import { useLogger, useRepository } from '../hooks'

export const SessionContext = React.createContext({
  state: LoginState.Unknown,
  currentUser: ConstantContent.VISITOR_USER as User,
  groups: [] as Group[],
})

export const SessionContextProvider: React.FunctionComponent = props => {
  const repo = useRepository()
  const logger = useLogger('SessionContext')
  const [loadLock] = useState(new Semaphore(1))
  const [state, setState] = useState(LoginState.Unknown)
  const [user, setUser] = useState<User>(ConstantContent.VISITOR_USER as User)
  const [groups, setGroups] = useState<Group[]>([])

  useEffect(() => {
    const ac = new AbortController()
    const observables = [
      repo.authentication.state.subscribe(s => {
        setState(s)
      }, true),
      repo.authentication.currentUser.subscribe(async usr => {
        logger.debug({
          message: `Current user chagned.`,
          data: {
            relatedRepository: repo.configuration.repositoryUrl,
            relatedContent: usr,
            multiple: true,
            digestMessage: 'Current user changed {count} times',
          },
        })
        if (usr.Id === ConstantContent.VISITOR_USER.Id) {
          return
        }
        try {
          await loadLock.acquire()
          setUser(usr)
          const result = await repo.security.getParentGroups({
            contentIdOrPath: usr.Id,
            directOnly: false,
            oDataOptions: {
              select: ['Name'],
            },
            requestInit: {
              signal: ac.signal,
            },
          })
          setGroups(result.d.results)
        } catch (error) {
          if (!ac.signal.aborted) {
            setGroups([])
            logger.debug({
              message: `User groups could not be loaded.`,
              data: {
                relatedRepository: repo.configuration.repositoryUrl,
                relatedContent: usr,
                error: isExtendedError(error) ? repo.getErrorFromResponse(error.response) : error,
              },
            })
          }
        } finally {
          loadLock.release()
        }
      }, true),
    ]
    repo.authentication.checkForUpdate()
    return () => {
      observables.forEach(o => o.dispose())
      ac.abort()
    }
  }, [loadLock, logger, repo])
  return (
    <SessionContext.Provider value={{ state, currentUser: user, groups }}>{props.children}</SessionContext.Provider>
  )
}
