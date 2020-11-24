import { Content, ODataParams } from '@sensenet/client-core'
import { deepMerge, PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import { useRepository, useRepositoryEvents } from '../hooks'
import { CurrentContentContext } from './current-content'
import { LoadSettingsContext } from './load-settings'

/**
 * Context that will return with a list of a current content's children
 */
export const CurrentChildrenContext = React.createContext<GenericContent[]>([])
CurrentChildrenContext.displayName = 'CurrentChildrenContext'

export interface CurrentChildrenProviderProps {
  loadSettings?: ODataParams<GenericContent>
  alwaysRefresh?: boolean
}

/**
 * Provider component for the CurrentChildrenContext component
 * Loads the children of the current content.
 * Loads an ancestor list from the Repository. Has to be wrapped with a **CurrentContentContext** and a **RepositoryContext**
 */
export const CurrentChildrenProvider: React.FunctionComponent<CurrentChildrenProviderProps> = (props) => {
  const currentContent = useContext(CurrentContentContext)
  const [children, setChildren] = useState<GenericContent[]>([])

  const alwaysRefresh = props.alwaysRefresh || currentContent.Type === 'SmartFolder'

  const [reloadToken, setReloadToken] = useState(1)
  const repo = useRepository()
  const eventHub = useRepositoryEvents()
  const loadSettings = useContext(LoadSettingsContext)

  const requestReload = () => setReloadToken(Math.random())
  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      if (currentContent.Path) {
        try {
          const childrenResult = await repo.loadCollection<GenericContent>({
            path: currentContent.Path,
            requestInit: { signal: ac.signal },
            oDataOptions: deepMerge(loadSettings.loadChildrenSettings, props.loadSettings),
          })
          setChildren(childrenResult.d.results)
        } catch (err) {
          if (!ac.signal.aborted) {
            setError(err)
          }
        }
      }
    })()
    return () => ac.abort()
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

  if (error) {
    throw error
  }

  return <CurrentChildrenContext.Provider value={children}>{props.children}</CurrentChildrenContext.Provider>
}
