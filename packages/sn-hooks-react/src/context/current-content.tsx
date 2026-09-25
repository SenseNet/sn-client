import { ConstantContent, ODataParams } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import React, { createContext, FunctionComponent, useEffect, useRef, useState } from 'react'
import { useLogger, useRepository, useRepositoryEvents } from '../hooks'
import { useLocalization } from '../hooks/use-localization'

/**
 * Returns a given content as current content
 */
export const CurrentContentContext = createContext<GenericContent>(ConstantContent.PORTAL_ROOT)
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
  /** Handles a failed load instead of logging it. Aborted or superseded requests are ignored. */
  onError?: (error: Error) => void
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
export const CurrentContentProvider: FunctionComponent<CurrentContentProviderProps> = (props) => {
  const [content, setContent] = useState<GenericContent>(ConstantContent.EMPTY_CONTENT)
  const callbacks = useRef(props)
  callbacks.current = props
  const previousPath = useRef(props.idOrPath)
  const [reloadToken, setReloadToken] = useState(1)
  const reload = () => setReloadToken(Math.random())
  const repo = useRepository()
  const events = useRepositoryEvents()
  const logger = useLogger('CurrentContent')
  const localization = useLocalization()

  const reportError = useRef<(error: Error) => void>()
  reportError.current = (error) => {
    if (callbacks.current.onError) callbacks.current.onError(error)
    else logger.error({ message: localization.currentContextError, data: { error } })
  }

  useEffect(() => {
    const ac = new AbortController()
    const subscriptions = [
      events.onContentModified.subscribe((c) => {
        if (c.content.Id === content.Id) {
          reload()
        }
      }),
      events.onContentDeleted.subscribe(({ contentData }) => {
        if (!content.Path) return
        const deleted = contentData.find((item) => PathHelper.isInSubTree(content.Path, item.Path))
        if (!deleted) return
        void (async () => {
          try {
            const response = await repo.load({
              idOrPath: PathHelper.getParentPath(deleted.Path),
              requestInit: { signal: ac.signal },
            })
            if (!ac.signal.aborted) setContent(response.d)
          } catch (error) {
            if (!ac.signal.aborted) reportError.current?.(error)
          }
        })()
      }),
    ]
    return () => {
      ac.abort()
      subscriptions.forEach((s) => s.dispose())
    }
  }, [content.Id, content.Path, props.idOrPath, events.onContentDeleted, events.onContentModified, repo])

  useEffect(() => {
    const ac = new AbortController()
    if (previousPath.current !== props.idOrPath) {
      previousPath.current = props.idOrPath
      setContent(ConstantContent.EMPTY_CONTENT)
    }
    if (props.idOrPath) {
      ;(async () => {
        try {
          const response = await repo.load({
            idOrPath: props.idOrPath,
            requestInit: { signal: ac.signal },
            oDataOptions: props.oDataOptions,
          })

          if (ac.signal.aborted) return
          setContent(response.d)
          callbacks.current.onContentLoaded?.(response.d)
        } catch (error) {
          if (!ac.signal.aborted) {
            reportError.current?.(error)
          }
        }
      })()
    }
    return () => ac.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo, props.idOrPath, reloadToken])

  return (
    <CurrentContentContext.Provider value={content as GenericContent}>{props.children}</CurrentContentContext.Provider>
  )
}
