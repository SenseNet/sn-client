import { useEffect, useState } from 'react'
import { EventHub } from '@sensenet/repository-events'
import { useRepository } from './use-repository'

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
