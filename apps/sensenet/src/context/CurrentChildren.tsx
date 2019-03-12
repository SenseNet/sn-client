import { GenericContent } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import Semaphore from 'semaphore-async-await'
import { CurrentContentContext } from './CurrentContent'
import { RepositoryContext } from './RepositoryContext'
export const CurrentChildrenContext = React.createContext<GenericContent[]>([])

export const CurrentChildrenProvider: React.FunctionComponent = props => {
  const currentContent = useContext(CurrentContentContext)
  const [children, setChildren] = useState<GenericContent[]>([])
  const [loadLock] = useState(new Semaphore(1))

  const repo = useContext(RepositoryContext)
  useEffect(() => {
    ;(async () => {
      try {
        await loadLock.acquire()
        const childrenResult = await repo.loadCollection<GenericContent>({
          path: currentContent.Path,
          oDataOptions: {
            orderby: [['IsFolder', 'desc']],
            select: 'all',
            expand: 'CreatedBy',
          },
        })
        setChildren(childrenResult.d.results)
      } finally {
        loadLock.release()
      }
    })()
  }, [currentContent.Path, repo])

  return <CurrentChildrenContext.Provider value={children}>{props.children}</CurrentChildrenContext.Provider>
}
