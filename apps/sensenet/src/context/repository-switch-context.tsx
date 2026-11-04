import { createContext, useContext } from 'react'
import { AuthServerType } from '../auth-config'

export type RepositorySwitchContextValue = {
  authType: AuthServerType
  switchRepository: (repoUrl: string) => void
}

export const RepositorySwitchContext = createContext<RepositorySwitchContextValue>({
  authType: 'SNAuth',
  switchRepository: () => {},
})

export const useRepositorySwitch = () => useContext(RepositorySwitchContext)
