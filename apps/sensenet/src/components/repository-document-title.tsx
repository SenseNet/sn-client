import { useRepository } from '@sensenet/hooks-react'
import { useEffect } from 'react'
import { useRepositoryConnections } from '../hooks/use-repository-connections'
import { getRepositoryConnectionName } from '../services/repository-connections'
import { normalizeRepositoryUrl } from '../services/repository-session'

export function RepositoryDocumentTitle() {
  const repository = useRepository()
  const { connections } = useRepositoryConnections()
  const repoUrl = normalizeRepositoryUrl(repository.configuration.repositoryUrl)
  const connection = connections.find((item) => item.repoUrl === repoUrl)
  const title = `Admin: ${getRepositoryConnectionName(connection || { repoUrl })}`

  useEffect(() => {
    const previousTitle = document.title
    document.title = title
    return () => {
      document.title = previousTitle
    }
  }, [title])

  return null
}
