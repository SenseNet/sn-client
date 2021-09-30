import { useRepository } from '@sensenet/hooks-react'
import React, { createContext, useEffect, useState } from 'react'

export interface RepositoryType {
  repositoryType: string
}

export const defaultRepoType = {
  repositoryType: 'snaas',
}

export const ShareContext = createContext({
  repoType: defaultRepoType,
})

export const ShareProvider: React.FunctionComponent = (props) => {
  const repository = useRepository()
  const [repoType, setRepoType] = useState<RepositoryType>(defaultRepoType)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await repository.executeAction<any, RepositoryType>({
          idOrPath: '/Root',
          name: 'GetRepositoryType',
          method: 'GET',
        })

        setRepoType(response)
      } catch {
        return false
      }
    })()
  }, [repository])

  return <ShareContext.Provider value={{ repoType }}>{props.children}</ShareContext.Provider>
}
