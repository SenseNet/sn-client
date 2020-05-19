import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { UserState } from 'redux-oidc'
import { loadRepository, userChanged } from '@sensenet/redux/dist/Actions'
import { ConstantContent, Repository } from '@sensenet/client-core'
import { RepositoryContext } from '@sensenet/hooks-react'
import { EventHub } from '@sensenet/repository-events'
import { User } from '@sensenet/default-content-types'
import { rootStateType } from '../store/rootReducer'
import { defaultRepositoryConfig, dmsInjector } from '../DmsRepository'
import { store } from '..'

const RepoProvider: React.FunctionComponent<{ userChanged: Function; loadRepository: Function }> = (props) => {
  const stateAuth = useSelector<rootStateType, UserState>((state) => state.auth)
  const { user } = stateAuth
  const [repository, setRepository] = useState<Repository>()

  useEffect(() => {
    if (user) {
      const config = {
        ...defaultRepositoryConfig,
        token: user.access_token,
      }
      const newRepo = new Repository(config)

      // expose repository when run in Cypress
      if ((window as any).Cypress) {
        ;(window as any).repository = newRepo
      }

      setRepository(newRepo)
      store.reloadRepository(newRepo)

      const repositoryEvents = new EventHub(newRepo)

      dmsInjector.remove(EventHub)
      dmsInjector.setExplicitInstance(repositoryEvents)

      dmsInjector.remove(Repository)
      dmsInjector.setExplicitInstance(newRepo)

      const ac = new AbortController()
      const getUser = async () => {
        try {
          const result = await newRepo.load<User>({
            idOrPath: user!.profile.sub,
            oDataOptions: {
              select: 'all',
            },
            requestInit: {
              signal: ac.signal,
            },
          })
          props.userChanged(result.d)
        } catch (error) {
          if (!ac.signal.aborted) {
            props.userChanged(ConstantContent.VISITOR_USER)
          }
        }
      }
      getUser()

      return () => ac.abort()
    }
  }, [user, props])

  if (!repository?.configuration.token) {
    return null
  }

  return <RepositoryContext.Provider value={repository!}>{props.children}</RepositoryContext.Provider>
}

export const RepositoryProvider = connect(null, { loadRepository, userChanged })(RepoProvider)
