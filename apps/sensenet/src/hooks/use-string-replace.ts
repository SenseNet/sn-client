import { useRepository } from '@sensenet/hooks-react'
import { useAuth } from '../context/auth-provider'

export const useStringReplace = (content: string) => {
  const { user } = useAuth()
  const repo = useRepository()

  if (!user) return content

  const newReplacedContent = content
    .replace('{currentUserName}', user.FullName ?? user.DisplayName ?? user.Name)
    .replace('{currentRepositoryName}', repo.configuration.repositoryUrl)
    .replace('{currentRepositoryUrl}', repo.configuration.repositoryUrl)

  return newReplacedContent
}
