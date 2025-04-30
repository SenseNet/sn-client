import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react'

interface TreeLoadingContextType {
  isTreeLoading: boolean
  setIsTreeLoading: Dispatch<SetStateAction<boolean>>
  treeWidth: number
  setTreeWidth: Dispatch<SetStateAction<number>>
  enabledPath: string
  setEnabledPath: Dispatch<SetStateAction<string>>
}

const TreeLoadingContext = createContext<TreeLoadingContextType | undefined>(undefined)

interface TreeLoadingProviderProps {
  children: ReactNode
}

export const TreeLoadingProvider: React.FC<TreeLoadingProviderProps> = ({ children }) => {
  const [isTreeLoading, setIsTreeLoading] = useState<boolean>(true)
  const [treeWidth, setTreeWidth] = useState<number>(400)
  const [enabledPath, setEnabledPath] = useState<string>('')

  return (
    <TreeLoadingContext.Provider
      value={{ isTreeLoading, setIsTreeLoading, treeWidth, setTreeWidth, enabledPath, setEnabledPath }}>
      {children}
    </TreeLoadingContext.Provider>
  )
}

export const useTreeLoading = (): TreeLoadingContextType => {
  const context = useContext(TreeLoadingContext)
  if (!context) {
    throw new Error('useTreeLoading must be used within a TreeLoadingProvider')
  }
  return context
}
