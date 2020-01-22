import React, { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react'
import { Repository } from '@sensenet/client-core'

type context =
  | {
      repository: Repository | undefined
      setRepository: Dispatch<SetStateAction<Repository | undefined>>
    }
  | undefined
const RepositoryContext = createContext<context>(undefined)

export function RepositoryProvider({ children }: PropsWithChildren<{}>) {
  const [repository, setRepository] = useState<Repository>()

  return <RepositoryContext.Provider value={{ repository, setRepository }}>{children}</RepositoryContext.Provider>
}

export function useSingleRepository() {
  const context = useContext(RepositoryContext)

  if (!context) {
    throw new Error('useSingleRepository can only be used inside of a RepositoryProvider')
  }

  const { repository, setRepository } = context

  const createRepository = (url: string) => setRepository(new Repository({ repositoryUrl: url }))

  const result = {
    get repository() {
      if (!repository) {
        throw new Error('you need to have a repository. call createRepository first!')
      }
      return repository
    },
    createRepository,
  }

  return result
}
