import { Repository } from '@sensenet/client-core'
import React, { useContext, useEffect, useState } from 'react'
import { RepositoryManager } from '../services/RepositoryManager'
import { InjectorContext } from './InjectorContext'
import { PersonalSettingsContext } from './PersonalSettingsContext'

export const lastRepositoryKey = 'sensenet-last-repository'

export const RepositoryContext = React.createContext<Repository>(new Repository())

export const RepositoryContextProvider: React.FunctionComponent = props => {
  const injector = useContext(InjectorContext)
  const repoManager = injector.GetInstance(RepositoryManager)
  const settings = useContext(PersonalSettingsContext)
  const [repo, setRepo] = useState(repoManager.getRepository(localStorage.getItem(lastRepositoryKey) || ''))

  useEffect(() => {
    setRepo(injector.getRepository(settings.lastRepository))
  }, [settings])

  return <RepositoryContext.Provider value={repo}>{props.children}</RepositoryContext.Provider>
}
