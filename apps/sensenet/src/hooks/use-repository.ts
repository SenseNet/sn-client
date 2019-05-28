import { useContext } from 'react'
import { RepositoryContext } from '../context'

export const useRepository = () => useContext(RepositoryContext)
