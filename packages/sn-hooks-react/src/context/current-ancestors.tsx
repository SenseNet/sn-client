import { ODataCollectionResponse } from '@sensenet/client-core'
import { debounce } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import Semaphore from 'semaphore-async-await'
import { useLogger, useRepository, useRepositoryEvents } from '../hooks'
import { CurrentContentContext } from './current-content'

/**
 * Context that will return with the current content's ancestors
 */
export const CurrentAncestorsContext = React.createContext<GenericContent[]>([])

export interface CurrentAncestorsProviderProps {
  /**
   * An optional root Path or ID. The top ancestor will be a content with the provided value.
   */
  root?: number | string
}

/**
 * Provider component for the CurrentAncestorsContext component.
 * Loads an ancestor list from the Repository. Has to be wrapped with a **CurrentContentContext** and a **RepositoryContext**
 */
export const CurrentAncestorsProvider: React.FunctionComponent<CurrentAncestorsProviderProps> = (props) => {
  const currentContent = useContext(CurrentContentContext)
  const [loadLock] = useState(new Semaphore(1))

  const [ancestors, setAncestors] = useState<GenericContent[]>([])
  const repo = useRepository()
  const eventHub = useRepositoryEvents()
  const [reloadToken, setReloadToken] = useState(1)

  const logger = useLogger('CurrentAncestorsProvider')

  const requestReload = debounce((newId: number) => {
    if (ancestors.map((a) => a.Id).includes(newId)) {
      setReloadToken(Math.random())
    }
  }, 100)

  useEffect(() => {
    const subscriptions = [
      eventHub.onContentModified.subscribe((mod) => {
        requestReload(mod.content.Id)
      }),
      eventHub.onContentMoved.subscribe((move) => {
        requestReload(move.content.Id)
      }),
      eventHub.onContentDeleted.subscribe((del) => {
        requestReload(del.contentData.Id)
      }),
    ]
    return () => subscriptions.forEach((s) => s.dispose())
  }, [
    ancestors,
    eventHub.onContentDeleted,
    eventHub.onContentModified,
    eventHub.onContentMoved,
    repo.configuration.repositoryUrl,
    requestReload,
  ])
  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        await loadLock.acquire()
        if ((props.root && currentContent.Id === props.root) || currentContent.Path === props.root) {
          setAncestors([])
        } else {
          const ancestorsResult = await repo.executeAction<undefined, ODataCollectionResponse<GenericContent>>({
            idOrPath: currentContent.Id,
            method: 'GET',
            name: 'Ancestors',
            body: undefined,
            requestInit: {
              signal: ac.signal,
            },
            oDataOptions: {
              orderby: [['Path', 'asc']],
            },
          })
          const rootIndex = ancestorsResult.d.results.findIndex((a) => a.Id === props.root || a.Path === props.root)
          setAncestors(rootIndex > 0 ? ancestorsResult.d.results.slice(rootIndex) : ancestorsResult.d.results)
        }
      } catch (err) {
        if (!ac.signal.aborted) {
          setError(err)
        }
      } finally {
        loadLock.release()
      }
    })()
    return () => ac.abort()
  }, [currentContent.Id, currentContent.Path, loadLock, props.root, reloadToken, repo])

  if (error) {
    logger.warning({
      message: `Error loading ancestors. ${error.message}`,
      data: { details: { error }, relatedContent: currentContent, relatedRepository: repo.configuration.repositoryUrl },
    })
  }
  return <CurrentAncestorsContext.Provider value={ancestors}>{props.children}</CurrentAncestorsContext.Provider>
}
