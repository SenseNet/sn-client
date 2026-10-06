import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react'

interface GridLoadingContextType {
  isGridLoading: boolean
  setIsGridLoading: Dispatch<SetStateAction<boolean>>
}

const GridLoadingContext = createContext<GridLoadingContextType | undefined>(undefined)

interface GridLoadingProviderProps {
  children: ReactNode
}

export const GridLoadingProvider: React.FC<GridLoadingProviderProps> = ({ children }) => {
  const [isGridLoading, setIsGridLoading] = useState<boolean>(false)

  return (
    <GridLoadingContext.Provider value={{ isGridLoading, setIsGridLoading }}>{children}</GridLoadingContext.Provider>
  )
}

export const useGridLoading = (): GridLoadingContextType => {
  const context = useContext(GridLoadingContext)
  if (!context) {
    throw new Error('useGridLoading must be used within a GridLoadingProvider')
  }
  return context
}
