import { Repository } from '@sensenet/client-core'
import { createContext } from 'react'

export const RepositoryContext = createContext(new Repository())
