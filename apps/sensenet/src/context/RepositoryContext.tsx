import { Repository } from '@sensenet/client-core'
import React, { useContext, useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { RepositoryManager } from '../services/RepositoryManager'
import { InjectorContext } from './InjectorContext'
import { PersonalSettingsContext } from './PersonalSettingsContext'

export const lastRepositoryKey = 'sensenet-last-repository'

export const RepositoryContext = React.createContext<Repository>(new Repository())

export const RepositoryContextProviderComponent: React.FunctionComponent<
  RouteComponentProps<{ repo?: string }>
> = props => {
  const injector = useContext(InjectorContext)
  const repoManager = injector.getInstance(RepositoryManager)
  const settings = useContext(PersonalSettingsContext)
  const [repo, setRepo] = useState(repoManager.getRepository(localStorage.getItem(lastRepositoryKey) || ''))

  useEffect(() => {
    let repoFromUrl = ''
    try {
      repoFromUrl = (props.match.params.repo && atob(props.match.params.repo)) || ''
    } catch (error) {
      /** */
    }
    const newRepo = injector.getRepository(
      repoFromUrl.startsWith('http://') || repoFromUrl.startsWith('https://') ? repoFromUrl : settings.lastRepository,
    )
    setRepo(newRepo)
  }, [settings.lastRepository, props.match.params.repo])

  return <RepositoryContext.Provider value={repo}>{props.children}</RepositoryContext.Provider>
}

const routed = withRouter(RepositoryContextProviderComponent)
export { routed as RepositoryContextProvider }
