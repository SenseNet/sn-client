import { useEffect, useState } from 'react'
import { User } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'

/**
 * Custom hook that will return with the current user.
 */
export const useCurrentUser = () => {
  const repo = useRepository()
  const [currentUser, setCurrentUser] = useState<User>(repo.authentication.currentUser.getValue())
  useEffect(() => {
    const observable = repo.authentication.currentUser.subscribe((usr) => setCurrentUser(usr), true)
    return () => observable.dispose()
  }, [repo])

  return currentUser
}
