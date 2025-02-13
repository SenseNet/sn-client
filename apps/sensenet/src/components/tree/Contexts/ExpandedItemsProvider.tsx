import { ODataCollectionResponse } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { createContext, ReactNode, useEffect, useRef, useState } from 'react'
// Meghatározzuk a Context típusát: egy string tömb és egy setter függvény
type ExpandItemsContextType = [
  Set<string>,
  React.Dispatch<React.SetStateAction<Set<string>>>,
  (path: string) => Promise<GenericContent[] | undefined>,
  React.Dispatch<React.SetStateAction<number>>,
]

// Létrehozzuk a Context-et alapértelmezett értékekkel
export const ExpandItemsContext = createContext<ExpandItemsContextType | undefined>(undefined)

const ExpandedItemsProvider = ({ children }: { children: ReactNode }) => {
  const [expandItems, setExpandItems] = useState<Set<string>>(new Set())
  const cache = useRef<{ [key: string]: { data: GenericContent[] | undefined; timestamp: number } }>({}) // Globális cache objektum
  const [cacheTime, setCacheTime] = useState<number>(6000)
  const repo = useRepository()
  const loadChildren = async (path: string): Promise<GenericContent[] | undefined> => {
    //letölti a connteneteket a megadott path alapján
    const loadCollection = function loadCollection(
      contentPath: string,
    ): Promise<ODataCollectionResponse<GenericContent>> {
      return repo.loadCollection<GenericContent>({
        path: contentPath,
        oDataOptions: {
          select: ['Id', 'Path', 'Name', 'DisplayName', 'Type', 'Actions', 'Icon', 'ParentId'],
          onlyselectList: true,
        },
      })
    }
    //cache logika
    if (path === undefined || path === '') return undefined
    const now = Date.now()
    //ha a cachben nincs elem akkor tovább megyünk
    if (cache.current[path] !== undefined) {
      //ha a cacheben van elem és undefined akkor várunk
      let i = 0
      while (cache.current[path].data === undefined) {
        setTimeout(() => {}, 200)
        console.log('#globalfetch: waiting for response', path)
        i++
        if (i > 10) {
          console.log('#globalfetch: max iteration exceeded', path)
          return undefined
        }
      }

      //ha a cacheben van elem és nem undefined akkor visszadjuk azt
      if (now - cache.current[path].timestamp < cacheTime) {
        console.log('#globalfetch: from cache', path)
        return (
          cache.current[path] as {
            data: GenericContent[] | undefined
            timestamp: number
          }
        )?.data
      }
    }
    try {
      const response = await loadCollection(path)
      //itt megkéne várni, esetleg egy await async meoldaná a problémát
      const result = response?.d.results
      cache.current[path] = { data: result, timestamp: now }
      console.log('#globalfetch: miss cache', path)
      return result
      //ezt nem várja meg
    } catch (error) {
      console.error('#globalfetch: Fetch error:', error)
    }
  }

  return (
    <ExpandItemsContext.Provider value={[expandItems, setExpandItems, loadChildren, setCacheTime]}>
      {children}
    </ExpandItemsContext.Provider>
  )
}

export default ExpandedItemsProvider
