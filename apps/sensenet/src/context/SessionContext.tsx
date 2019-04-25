import { ConstantContent, LoginState } from '@sensenet/client-core'
import { debounce } from '@sensenet/client-utils'
import { Group, User } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import Semaphore from 'semaphore-async-await'
import { RepositoryContext } from './RepositoryContext'

export const SessionContext = React.createContext({
  state: LoginState.Unknown,
  debouncedState: LoginState.Unknown,
  currentUser: ConstantContent.VISITOR_USER as User,
  groups: [] as Group[],
})

export const SessionContextProvider: React.FunctionComponent = props => {
  const repo = useContext(RepositoryContext)
  const [loadLock] = useState(new Semaphore(1))
  const [state, setState] = useState(LoginState.Unknown)
  const [debouncedState, setDebouncedState] = useState(LoginState.Unknown)
  const [user, setUser] = useState<User>(ConstantContent.VISITOR_USER as User)
  const [groups, setGroups] = useState<Group[]>([])
  useEffect(() => {
    const updateState = debounce((s: LoginState) => {
      setDebouncedState(s)
    }, 2000)

    const observables = [
      repo.authentication.state.subscribe(s => {
        updateState(s)
        setState(s)
      }, true),
      repo.authentication.currentUser.subscribe(async usr => {
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
          })
          setGroups(result.d.results)
        } catch {
          setGroups([])
        } finally {
          loadLock.release()
        }
      }, true),
    ]
    repo.authentication.checkForUpdate()
    return () => observables.forEach(o => o.dispose())
  }, [repo])
  return (
    <SessionContext.Provider value={{ state, currentUser: user, groups, debouncedState }}>
      {props.children}
    </SessionContext.Provider>
  )
}
