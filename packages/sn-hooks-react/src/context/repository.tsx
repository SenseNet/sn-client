import { Repository } from '@sensenet/client-core'
import { createContext } from 'react'

/**
 * Context that stores the current Repository instance
 */
export const RepositoryContext = createContext(new Repository())
RepositoryContext.displayName = 'RepositoryContext'
