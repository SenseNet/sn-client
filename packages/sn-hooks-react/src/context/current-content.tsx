import { ConstantContent, ODataParams } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useEffect, useState } from 'react'
import Semaphore from 'semaphore-async-await'
import { useRepository, useRepositoryEvents } from '../hooks'

/**
 * Returns a given content as current content
 */
export const CurrentContentContext = React.createContext<GenericContent>(ConstantContent.PORTAL_ROOT)
CurrentContentContext.displayName = 'CurrentContentContext'

export interface CurrentContentProviderProps {
  /**
   * The Id or Path for the current content item
   */
  idOrPath: number | string
  /**
   * Optional callback that will be triggered when the content loads
   */
  onContentLoaded?: (content: GenericContent) => void
  /**
   * Optional OData options for loading the content
   */
  oDataOptions?: ODataParams<GenericContent>
}

/**
 * Provider component for the CurrentContentContext component.
 * Loads a content from the Repository with the given Id or Path.
 * Has to be wrapped with a **RepositoryContext**
 */
export const CurrentContentProvider: React.FunctionComponent<CurrentContentProviderProps> = (props) => {
  const [loadLock] = useState(new Semaphore(1))
  const [content, setContent] = useState<GenericContent>(ConstantContent.EMPTY_CONTENT)
  const [errorState, setErrorState] = useState<{
    currentPath?: string | number
    status?: number
    error?: Error | undefined
  }>()
  const [reloadToken, setReloadToken] = useState(1)
  const reload = () => setReloadToken(Math.random())
  const repo = useRepository()
  const events = useRepositoryEvents()

  useEffect(() => {
    const subscriptions = [
      events.onContentModified.subscribe((c) => {
        if (c.content.Id === content.Id) {
          reload()
        }
      }),
      events.onContentDeleted.subscribe(async (c) => {
        const parentContent = await repo.load({ idOrPath: PathHelper.getParentPath(c.contentData.Path) })
        setContent(parentContent.d)
      }),
    ]
    return () => subscriptions.forEach((s) => s.dispose())
  }, [content.Id, events.onContentDeleted, events.onContentModified, repo])

  useEffect(() => {
    const ac = new AbortController()
    if (props.idOrPath) {
      ;(async () => {
        try {
          const response = await repo.load({
            idOrPath: props.idOrPath,
            requestInit: { signal: ac.signal },
            oDataOptions: props.oDataOptions,
          })
          setContent(response.d)
          props.onContentLoaded && props.onContentLoaded(response.d)
        } catch (error) {
          if (!ac.signal.aborted) {
            setErrorState({
              currentPath: props.idOrPath,
              status: error.response?.status,
              error,
            })
          }
        } finally {
          loadLock.release()
        }
      })()
    }
    return () => ac.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo, props.idOrPath, reloadToken, loadLock])

  if (errorState?.error) {
    if (errorState?.status === 404) {
      throw errorState
    }
    throw errorState.error
  }

  return (
    <CurrentContentContext.Provider value={content as GenericContent}>{props.children}</CurrentContentContext.Provider>
  )
}
