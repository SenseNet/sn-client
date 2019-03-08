import { Repository } from '@sensenet/client-core'
import React, { useContext, useEffect, useState } from 'react'
import { RepositoryManager } from '../services/RepositoryManager'
import { InjectorContext } from './InjectorContext'

export const lastRepositoryKey = 'sensenet-last-repository'

export const RepositoryContext = React.createContext<Repository>(new Repository())

export const RepositoryContextProvider: React.FunctionComponent = props => {
  const injector = useContext(InjectorContext)
  const repoManager = injector.GetInstance(RepositoryManager)
  const [repo, setRepo] = useState(repoManager.getRepository(localStorage.getItem(lastRepositoryKey) || ''))

  useEffect(() => {
    const observable = repoManager.currentRepository.subscribe(r => {
      localStorage.setItem(lastRepositoryKey, r.configuration.repositoryUrl)
      setRepo(r)
    })
    return () => observable.dispose()
  })

  return <RepositoryContext.Provider value={repo}>{props.children}</RepositoryContext.Provider>
}
