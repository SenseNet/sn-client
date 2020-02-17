import { useEffect, useState } from 'react'
import { useRepoState } from '../services'

export const useStringReplace = (content: string) => {
  const [replacedContent, setReplacedContent] = useState<string>()
  const repoState = useRepoState().getCurrentRepoState()!

  useEffect(() => {
    const newReplacedContent = content
      .replace(
        '{currentUserName}',
        repoState.currentUser.FullName ?? repoState.currentUser.DisplayName ?? repoState.currentUser.Name,
      )
      .replace(
        '{currentRepositoryName}',
        repoState.repository.configuration.repositoryUrl || repoState.repository.configuration.repositoryUrl,
      )
      .replace('{currentRepositoryUrl}', repoState.repository.configuration.repositoryUrl)

    setReplacedContent(newReplacedContent)
  }, [
    content,
    repoState.currentUser.DisplayName,
    repoState.currentUser.FullName,
    repoState.currentUser.Name,
    repoState.repository.configuration.repositoryUrl,
  ])

  return replacedContent
}
