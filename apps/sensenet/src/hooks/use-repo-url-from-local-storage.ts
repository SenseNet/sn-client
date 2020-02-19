import { useCallback, useEffect, useState } from 'react'

export const repositoryUrlKey = 'repository-url'

export function useRepoUrlFromLocalStorage() {
  const [currentRepoUrl, setCurrentRepoUrl] = useState<string | null>(null)

  useEffect(() => {
    const repoUrl = window.localStorage.getItem(repositoryUrlKey)
    setCurrentRepoUrl(repoUrl)
  }, [])

  const setRepoUrl = useCallback((url: string) => window.localStorage.setItem(repositoryUrlKey, url), [])

  return { repoUrl: currentRepoUrl, setRepoUrl }
}
