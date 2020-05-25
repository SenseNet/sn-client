import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { Created } from '@sensenet/repository-events'
import React, { useContext, useEffect, useState } from 'react'
import { useRepository, useRepositoryEvents } from '../hooks'
import { CurrentContentContext } from './current-content'
import { LoadSettingsContext } from './load-settings'

/**
 * Context that will return with a list of a current content's children
 */
export const CurrentChildrenContext = React.createContext<GenericContent[]>([])
CurrentChildrenContext.displayName = 'CurrentChildrenContext'

/**
 * Provider component for the CurrentChildrenContext component
 * Loads the children of the current content.
 * Loads an ancestor list from the Repository. Has to be wrapped with a **CurrentContentContext** and a **RepositoryContext**
 */
export const CurrentChildrenProvider: React.FunctionComponent = (props) => {
  const currentContent = useContext(CurrentContentContext)
  const [children, setChildren] = useState<GenericContent[]>([])

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
            oDataOptions: loadSettings.loadChildrenSettings,
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
  }, [currentContent.Path, loadSettings.loadChildrenSettings, repo, reloadToken])

  useEffect(() => {
    const handleCreate = (c: Created) => {
      if ((c.content as GenericContent).ParentId === currentContent.Id) {
        return requestReload()
      }
      if (PathHelper.isAncestorOf(currentContent.Path, c.content.Path)) {
        requestReload()
      }
    }

    const subscriptions = [
      eventHub.onCustomActionExecuted.subscribe((event) => {
        if (event.actionOptions.method !== 'GET') {
          requestReload()
        }
      }),
      eventHub.onContentCreated.subscribe(handleCreate),
      eventHub.onContentCopied.subscribe(handleCreate),
      eventHub.onContentMoved.subscribe(handleCreate),
      eventHub.onContentModified.subscribe((mod) => {
        if (children.some((c) => c.Id === mod.content.Id)) {
          requestReload()
        }
      }),

      eventHub.onUploadFinished.subscribe((data) => {
        if (PathHelper.getParentPath(data.Url) === PathHelper.trimSlashes(currentContent.Path)) {
          requestReload()
        }
      }),
      eventHub.onContentDeleted.subscribe((d) => {
        if (PathHelper.getParentPath(d.contentData.Path) === PathHelper.trimSlashes(currentContent.Path)) {
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
  ])

  if (error) {
    throw error
  }

  return <CurrentChildrenContext.Provider value={children}>{props.children}</CurrentChildrenContext.Provider>
}
