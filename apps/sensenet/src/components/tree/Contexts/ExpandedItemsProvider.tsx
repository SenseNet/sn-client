import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { createContext, ReactNode, useRef, useState } from 'react'
// Meghatározzuk a Context típusát: egy string tömb és egy setter függvény
type ExpandItemsContextType = [
  Set<string>,
  React.Dispatch<React.SetStateAction<Set<string>>>,
  Set<string>,
  React.Dispatch<React.SetStateAction<Set<string>>>,
  (path: string) => Promise<GenericContent[] | undefined>,
  React.Dispatch<React.SetStateAction<number>>,
  (path: string) => void,
]

export const ExpandItemsContext = createContext<ExpandItemsContextType | undefined>(undefined)

const ExpandedItemsProvider = ({ children }: { children: ReactNode }) => {
  const [expandItems, setExpandItems] = useState<Set<string>>(new Set())
  const [expandOriginalItems, setExpandOriginalItems] = useState<Set<string>>(new Set())
  const [cacheTime, setCacheTime] = useState<number>(6000)
  const cache = useRef<{ [key: string]: { data: GenericContent[] | undefined; timestamp: number } }>({})
  const repo = useRepository()

  const loadChildren = async (path: string): Promise<GenericContent[] | undefined> => {
    if (!path) return undefined

    const now = Date.now()

    const cached = cache.current[path]
    if (cached) {
      if (cached.data !== undefined && now - cached.timestamp < cacheTime) {
        return cached.data
      }

      // Wait if data is still loading (i.e., placeholder is in cache with undefined data)
      if (cached.data === undefined) {
        // Polling-based wait
        for (let i = 0; i < 10; i++) {
          await new Promise((res) => setTimeout(res, 200))
          const recheck = cache.current[path]
          if (recheck?.data !== undefined && now - recheck.timestamp < cacheTime) {
            return recheck.data
          }
        }
        return undefined // Timeout
      }
    }

    // Mark as loading
    cache.current[path] = { data: undefined, timestamp: now }

    try {
      const response = await repo.loadCollection<GenericContent>({
        path,
        oDataOptions: {
          select: ['Id', 'Path', 'Name', 'DisplayName', 'Type', 'Actions', 'Icon', 'ParentId'],
          filter: 'IsFolder eq true',
          onlyselectList: true,
        },
      })
      const result = response?.d.results
      cache.current[path] = { data: result, timestamp: Date.now() }
      return result
    } catch (error) {
      console.error('#globalfetch: Fetch error:', error)
      // Clean up failed cache
      delete cache.current[path]
      return undefined
    }
  }

  const deleteCache = (path: string) => {
    delete cache.current[path]
  }

  return (
    <ExpandItemsContext.Provider
      value={[
        expandItems,
        setExpandItems,
        expandOriginalItems,
        setExpandOriginalItems,
        loadChildren,
        setCacheTime,
        deleteCache,
      ]}>
      {children}
    </ExpandItemsContext.Provider>
  )
}

export default ExpandedItemsProvider
