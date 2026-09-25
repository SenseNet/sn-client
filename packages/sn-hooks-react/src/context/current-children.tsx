import { Content, ODataParams } from '@sensenet/client-core'
import { deepMerge, PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import React, { createContext, FunctionComponent, useContext, useEffect, useRef, useState } from 'react'
import { useRepository, useRepositoryEvents } from '../hooks'
import { CurrentContentContext } from './current-content'
import { LoadSettingsContext } from './load-settings'

/**
 * Context that will return with a list of a current content's children
 */
export const CurrentChildrenContext = createContext<GenericContent[]>([])
CurrentChildrenContext.displayName = 'CurrentChildrenContext'

export const CurrentChildrenIsLoadingContext = createContext<boolean>(false)
CurrentChildrenIsLoadingContext.displayName = 'CurrentChildrenIsLoadingContext'

export interface CurrentChildrenProviderProps {
  loadSettings?: ODataParams<GenericContent>
  alwaysRefresh?: boolean
  /** Handles a failed load instead of passing it to an error boundary. */
  onError?: (error: Error) => void
}

/**
 * Provider component for the CurrentChildrenContext component
 * Loads the children of the current content.
 * Loads an ancestor list from the Repository. Has to be wrapped with a **CurrentContentContext** and a **RepositoryContext**
 */
export const CurrentChildrenProvider: FunctionComponent<CurrentChildrenProviderProps> = (props) => {
  const currentContent = useContext(CurrentContentContext)
  const [children, setChildren] = useState<GenericContent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const alwaysRefresh = props.alwaysRefresh || currentContent.Type === 'SmartFolder'

  const [reloadToken, setReloadToken] = useState(1)
  const repo = useRepository()
  const eventHub = useRepositoryEvents()
  const loadSettings = useContext(LoadSettingsContext)

  const requestReload = () => setReloadToken(Math.random())
  const [error, setError] = useState<{ path: string; error: Error }>()
  const onError = useRef(props.onError)
  onError.current = props.onError
  const childrenPath = useRef(currentContent.Path)

  useEffect(() => {
    const ac = new AbortController()
    let isCurrentRequest = true
    if (childrenPath.current !== currentContent.Path) {
      childrenPath.current = currentContent.Path
      setChildren([])
    }
    ;(async () => {
      if (!currentContent.Path) {
        setChildren([])
        setIsLoading(false)
        return
      }

      setError(undefined)
      setIsLoading(true)

      try {
        const childrenResult = await repo.loadCollection<GenericContent>({
          path: currentContent.Path,
          requestInit: { signal: ac.signal },
          oDataOptions: deepMerge(loadSettings.loadChildrenSettings, props.loadSettings),
        })

        if (isCurrentRequest) {
          setChildren(childrenResult.d.results)
        }
      } catch (err) {
        if (isCurrentRequest && !ac.signal.aborted) {
          if (onError.current) onError.current(err)
          else setError({ path: currentContent.Path, error: err })
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false)
        }
      }
    })()
    return () => {
      isCurrentRequest = false
      ac.abort()
    }
  }, [currentContent.Path, loadSettings.loadChildrenSettings, props.loadSettings, repo, reloadToken])

  useEffect(() => {
    const handleCreate = (contents: Content[]) => {
      if (
        alwaysRefresh ||
        contents.some(
          (createdContent) =>
            (createdContent as GenericContent).ParentId === currentContent.Id ||
            PathHelper.isAncestorOf(currentContent.Path, createdContent.Path),
        )
      ) {
        requestReload()
      }
    }

    const subscriptions = [
      eventHub.onCustomActionExecuted.subscribe((event) => {
        if (event.actionOptions.method !== 'GET') {
          switch (event.actionOptions.name) {
            case 'DeleteBatch':
            case 'MoveBatch':
            case 'CopyBatch':
            case 'PreviewAvailable':
            case 'RegeneratePreviews':
            case 'GetExistingPreviewImages':
              return
            case 'Restore':
              if (
                alwaysRefresh ||
                PathHelper.getParentPath(event.actionOptions.idOrPath) === PathHelper.trimSlashes(currentContent.Path)
              ) {
                return requestReload()
              }
              break
            default:
              requestReload()
          }
        }
      }),
      eventHub.onContentCreated.subscribe((created) => handleCreate([created.content])),
      eventHub.onContentCopied.subscribe((copied) => handleCreate(copied.content)),
      eventHub.onContentMoved.subscribe((moved) => {
        if (
          moved.content.some(
            (content) =>
              alwaysRefresh ||
              PathHelper.isAncestorOf(currentContent.Path, content.Path) ||
              PathHelper.getParentPath(content.OriginalPath) === PathHelper.trimSlashes(currentContent.Path),
          )
        ) {
          requestReload()
        }
      }),
      eventHub.onContentModified.subscribe((mod) => {
        if (alwaysRefresh || mod.forceRefresh || children.some((c) => c.Id === mod.content.Id)) {
          requestReload()
        }
      }),

      eventHub.onUploadFinished.subscribe((data) => {
        if (alwaysRefresh || PathHelper.isAncestorOf(currentContent.Path, data.Url)) {
          requestReload()
        }
      }),
      eventHub.onContentDeleted.subscribe((del) => {
        if (
          alwaysRefresh ||
          del.contentData.some(
            (deletedContent) =>
              PathHelper.getParentPath(deletedContent.Path) === PathHelper.trimSlashes(currentContent.Path),
          )
        ) {
          requestReload()
        }
      }),
    ]

    return () => subscriptions.forEach((s) => s.dispose())
  }, [
    currentContent,
    repo,
    children,
    eventHub.onCustomActionExecuted,
    eventHub.onContentCreated,
    eventHub.onContentCopied,
    eventHub.onContentMoved,
    eventHub.onContentModified,
    eventHub.onContentDeleted,
    eventHub.onUploadFinished,
    alwaysRefresh,
  ])

  if (error && error.path === currentContent.Path) {
    throw error.error
  }

  return (
    <CurrentChildrenIsLoadingContext.Provider value={isLoading}>
      <CurrentChildrenContext.Provider value={children}>{props.children}</CurrentChildrenContext.Provider>
    </CurrentChildrenIsLoadingContext.Provider>
  )
}
