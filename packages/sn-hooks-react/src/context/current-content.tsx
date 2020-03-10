import { ConstantContent, ODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useEffect, useState } from 'react'
import Semaphore from 'semaphore-async-await'
import { PathHelper } from '@sensenet/client-utils'
import { useRepository, useRepositoryEvents } from '../hooks'

/**
 * Returns a given content as current content
 */
export const CurrentContentContext = React.createContext<GenericContent>(ConstantContent.PORTAL_ROOT)

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
export const CurrentContentProvider: React.FunctionComponent<CurrentContentProviderProps> = props => {
  const [loadLock] = useState(new Semaphore(1))
  const [content, setContent] = useState<GenericContent>(ConstantContent.PORTAL_ROOT)
  const repo = useRepository()
  const [reloadToken, setReloadToken] = useState(1)
  const reload = () => setReloadToken(Math.random())
  const events = useRepositoryEvents()

  useEffect(() => {
    const subscriptions = [
      events.onContentModified.subscribe(c => {
        if (c.content.Id === content.Id) {
          reload()
        }
      }),
      events.onContentDeleted.subscribe(async c => {
        console.log(c)
        const parentContent = await repo.load({ idOrPath: PathHelper.getParentPath(c.contentData.Path) })
        setContent(parentContent.d)
      }),
    ]
    return () => subscriptions.forEach(s => s.dispose())
  }, [content.Id, content.Path, events.onContentDeleted, events.onContentModified, repo])

  const [error, setError] = useState<Error | undefined>()

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
        } catch (err) {
          if (!ac.signal.aborted) {
            setError(err)
          }
        } finally {
          loadLock.release()
        }
      })()
    }
    return () => ac.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo, props.idOrPath, reloadToken, loadLock])

  if (error) {
    throw error
  }

  return (
    <CurrentContentContext.Provider value={content as GenericContent}>{props.children}</CurrentContentContext.Provider>
  )
}
