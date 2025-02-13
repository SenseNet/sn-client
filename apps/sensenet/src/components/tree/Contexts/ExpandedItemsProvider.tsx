import React, { createContext, ReactNode, useState } from 'react'
// Meghatározzuk a Context típusát: egy string tömb és egy setter függvény
type ExpandItemsContextType = [Set<string>, React.Dispatch<React.SetStateAction<Set<string>>>]

// Létrehozzuk a Context-et alapértelmezett értékekkel
export const ExpandItemsContext = createContext<ExpandItemsContextType | undefined>(undefined)

const ExpandedItemsProvider = ({ children }: { children: ReactNode }) => {
  const [expandItems, setExpandItems] = useState<Set<string>>(new Set())
  return <ExpandItemsContext.Provider value={[expandItems, setExpandItems]}>{children}</ExpandItemsContext.Provider>
}

export default ExpandedItemsProvider
