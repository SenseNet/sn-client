import { ODataCollectionResponse } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import Semaphore from 'semaphore-async-await'
import { CurrentContentContext } from './CurrentContent'
import { RepositoryContext } from './RepositoryContext'
export const CurrentAncestorsContext = React.createContext<GenericContent[]>([])

export const CurrentAncestorsProvider: React.FunctionComponent = props => {
  const currentContent = useContext(CurrentContentContext)
  const [loadLock] = useState(new Semaphore(1))

  const [ancestors, setAncestors] = useState<GenericContent[]>([])
  const repo = useContext(RepositoryContext)
  useEffect(() => {
    ;(async () => {
      try {
        await loadLock.acquire()
        const ancestorsResult = await repo.executeAction<undefined, ODataCollectionResponse<GenericContent>>({
          idOrPath: currentContent.Path,
          method: 'GET',
          name: 'Ancestors',
          body: undefined,
          oDataOptions: {
            orderby: [['Path', 'asc']],
          },
        })
        setAncestors(ancestorsResult.d.results)
      } finally {
        loadLock.release()
      }
    })()
  }, [currentContent, repo])

  return <CurrentAncestorsContext.Provider value={ancestors}>{props.children}</CurrentAncestorsContext.Provider>
}
