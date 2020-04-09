import { useRepository } from '@sensenet/hooks-react'
import { useCurrentUser } from '../context/current-user-provider'

export const useStringReplace = (content: string) => {
  const currentUser = useCurrentUser()
  const repo = useRepository()

  const newReplacedContent = content
    .replace('{currentUserName}', currentUser.FullName ?? currentUser.DisplayName ?? currentUser.Name)
    .replace('{currentRepositoryName}', repo.configuration.repositoryUrl)
    .replace('{currentRepositoryUrl}', repo.configuration.repositoryUrl)

  return newReplacedContent
}
