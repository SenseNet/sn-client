import { useRepository } from '@sensenet/hooks-react'
import { EventHub } from '@sensenet/repository-events'
import { useEffect, useState } from 'react'

/**
 * Returns an EventHub instance of the current Repository
 * Works inside RepositoryContext.
 */
export const useRepositoryEvents = () => {
  const repo = useRepository()
  const [eventHub, setEventHub] = useState(new EventHub(repo))

  useEffect(() => {
    const eh = new EventHub(repo)
    setEventHub(eh)
    return () => eh.dispose()
  }, [repo])

  return eventHub
}
