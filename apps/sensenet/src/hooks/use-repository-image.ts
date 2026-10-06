import { Repository } from '@sensenet/client-core'
import { useEffect, useState } from 'react'

type ImageResult = { url: string; source?: string; error?: string }

/** Loads protected images without allowing late requests to retain blob URLs. */
export const useRepositoryImage = (
  repository: Repository,
  url?: string,
  { cache, retryToken = 0, revision }: { cache?: RequestCache; retryToken?: number; revision?: string } = {},
) => {
  const [result, setResult] = useState<ImageResult>()

  useEffect(() => {
    if (!url) {
      setResult(undefined)
      return
    }
    const controller = new AbortController()
    let current = true
    let objectUrl: string | undefined
    setResult(undefined)

    const load = async () => {
      try {
        const source = new URL(url)
        const { origin } = new URL(repository.configuration.repositoryUrl)
        if (
          source.origin !== origin ||
          !['http:', 'https:'].includes(source.protocol) ||
          source.username ||
          source.password
        ) {
          throw new Error('Image source is outside the current repository.')
        }
        const response = await repository.fetch(source.href, {
          method: 'GET',
          credentials: 'include',
          cache,
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`.trim())
        const blob = await response.blob()
        // Some fetch implementations finish blob() after abort. Do not allocate
        // an object URL once its owner has changed or unmounted.
        if (!current || controller.signal.aborted) return
        objectUrl = URL.createObjectURL(blob)
        setResult({ url, source: objectUrl })
      } catch (error) {
        if (current && !controller.signal.aborted) {
          setResult({ url, error: error instanceof Error ? error.message : String(error) })
        }
      }
    }
    load()

    return () => {
      current = false
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [cache, repository, retryToken, revision, url])

  const currentResult = result?.url === url ? result : undefined
  return {
    source: currentResult?.source,
    error: currentResult?.error,
    isLoading: Boolean(url && !currentResult),
  }
}
