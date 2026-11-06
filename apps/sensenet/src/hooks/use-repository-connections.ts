import { useEffect, useState } from 'react'
import {
  getRepositoryConnections,
  repositoryConnectionsChangedEvent,
  repositoryConnectionsStorageKey,
} from '../services/repository-connections'

export const useRepositoryConnections = () => {
  const [connections, setConnections] = useState(getRepositoryConnections)

  useEffect(() => {
    const update = () => setConnections(getRepositoryConnections())
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === repositoryConnectionsStorageKey) update()
    }
    window.addEventListener(repositoryConnectionsChangedEvent, update)
    window.addEventListener('storage', onStorage)
    update()
    return () => {
      window.removeEventListener(repositoryConnectionsChangedEvent, update)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  return { connections }
}
