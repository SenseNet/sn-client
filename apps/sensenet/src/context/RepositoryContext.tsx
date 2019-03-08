import { Repository } from '@sensenet/client-core'
import React from 'react'

export const RepositoryContext = React.createContext<Repository>(new Repository())
