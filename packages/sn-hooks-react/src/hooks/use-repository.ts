import { useContext } from 'react'
import { RepositoryContext } from '../context'

/**
 * Returns a Repository instance from the RepositoryContext
 */
export const useRepository = () => useContext(RepositoryContext)
