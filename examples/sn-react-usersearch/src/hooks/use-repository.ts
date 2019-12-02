import { useContext } from 'react'
import { RepositoryContext } from '@sensenet/hooks-react'

/**
 * Custom hook that will return with a Repository object
 */
export const useRepository = () => {
  return useContext(RepositoryContext)
}
