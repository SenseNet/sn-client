import { ODataCollectionResponse } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
// Meghatározzuk a Context típusát: egy string tömb és egy setter függvény
export type ContentRecord = Record<number | string, { content: GenericContent; lastUpdate: string }>

type CachedContentLoaderContextType = [
  ContentRecord,
  React.Dispatch<React.SetStateAction<ContentRecord>>,
  number,
  React.Dispatch<React.SetStateAction<number>>,
]

// Létrehozzuk a Context-et alapértelmezett értékekkel
export const CachedContentLoaderContext = createContext<CachedContentLoaderContextType | undefined>(undefined)

const CachedContentLoaderProvider = ({ children }: { children: ReactNode }) => {
  const repo = useRepository()
  const [storedContents, setStoredContents] = useState<ContentRecord>({})
  const [currentContextId, setCurrentContextId] = useState<number>(0)
  const [currentContextChildren, setCurrentContexChildren] = useState<ContentRecord>({})

  // const loadContentCollection = function loadCollection(contentPath: string): Promise<string> {
  //   const cached = Object.values(storedContents).find((item) => item.content.Path === contentPath)
  //   if (cached) {
  //     return Promise.resolve({
  //       d: {
  //         results: [item.content],
  //       },
  //     })
  //   }
  //   return repo.loadCollection<GenericContent>({
  //     path: contentPath,
  //     oDataOptions: {
  //       select: ['Id', 'Path', 'Name', 'DisplayName', 'Type', 'Actions', 'Icon', 'ParentId'],
  //       onlyselectList: true,
  //     },
  //   })
  // }
  const getChildren = (content: GenericContent) => {
    return Object.values(storedContents)
      .filter((item: { content: GenericContent; lastUpdate: string }) => item.content.ParentId === content.Id)
      .map((item) => item.content)
  }
  useEffect(() => {
    // loadContentCollection(currentContextId.toString()).then((result: any) => {
    //   const elements = result?.d.results.map((innerChild: GenericContent) => {
    //     return {
    //       content: innerChild,
    //       lastUpdate: new Date().toISOString(),
    //     }
    //   })
    //   const updatedContents = { ...storedContents }
    //   elements.forEach((element: { content: GenericContent; lastUpdate: string }) => {
    //     updatedContents[element.content.Id] = element
    //   })
    //   setStoredContents(updatedContents)
    // })
    console.log('CachedContentLoaderProvider useEffect')
  }, [currentContextId, repo, storedContents])
  return (
    <CachedContentLoaderContext.Provider
      value={[storedContents, setStoredContents, currentContextId, setCurrentContextId]}>
      {children}
    </CachedContentLoaderContext.Provider>
  )
}

export default CachedContentLoaderProvider
