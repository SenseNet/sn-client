import { useContext } from 'react'
import { RepositoryContext } from '../context/repository-provider'

/**
 * Custom hook that will return with a Repository object
 */
export const useRepository = () => {
  return useContext(RepositoryContext)
}
