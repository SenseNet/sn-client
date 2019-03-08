import { ConstantContent, LoginState } from '@sensenet/client-core'
import { User } from '@sensenet/default-content-types'
import { useContext, useEffect, useState } from 'react'
import React from 'react'
import { RepositoryContext } from './RepositoryContext'

export const SessionContext = React.createContext({
  state: LoginState.Unknown,
  currentUser: ConstantContent.VISITOR_USER as User,
})

export const SessionContextProvider: React.FunctionComponent = props => {
  const repo = useContext(RepositoryContext)
  const [state, setState] = useState(LoginState.Unknown)
  const [user, setUser] = useState<User>(ConstantContent.VISITOR_USER as User)
  useEffect(() => {
    const observables = [
      repo.authentication.state.subscribe(s => setState(s), true),
      repo.authentication.currentUser.subscribe(usr => setUser(usr), true),
    ]
    repo.authentication.checkForUpdate()
    return () => observables.forEach(o => o.dispose())
  }, [])
  return <SessionContext.Provider value={{ state, currentUser: user }}>{props.children}</SessionContext.Provider>
}
