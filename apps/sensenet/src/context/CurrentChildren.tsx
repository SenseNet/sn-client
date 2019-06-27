import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { Created } from '@sensenet/repository-events'
import React, { useContext, useEffect, useState } from 'react'
import Semaphore from 'semaphore-async-await'
import { useInjector, useRepository } from '../hooks'
import { UploadTracker } from '../services/UploadTracker'
import { CurrentContentContext } from './CurrentContent'
import { LoadSettingsContext } from './LoadSettingsContext'
export const CurrentChildrenContext = React.createContext<GenericContent[]>([])

export const CurrentChildrenProvider: React.FunctionComponent = props => {
  const currentContent = useContext(CurrentContentContext)
  const injector = useInjector()
  const [children, setChildren] = useState<GenericContent[]>([])
  const [loadLock] = useState(new Semaphore(1))

  const [reloadToken, setReloadToken] = useState(1)
  const repo = useRepository()
  const eventHub = injector.getEventHub(repo.configuration.repositoryUrl)
  const uploadTracker = injector.getInstance(UploadTracker)
  const loadSettings = useContext(LoadSettingsContext)

  const requestReload = () => setReloadToken(Math.random())
  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        await loadLock.acquire()
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
      } finally {
        loadLock.release()
      }
    })()
    return () => ac.abort()
  }, [currentContent.Path, loadSettings.loadChildrenSettings, repo, reloadToken, loadLock])

  useEffect(() => {
    const handleCreate = (c: Created) => {
      if ((c.content as GenericContent).ParentId === currentContent.Id) {
        requestReload()
      }
      if (parent && PathHelper.isAncestorOf(currentContent.Path, c.content.Path)) {
        requestReload()
      }
    }

    const subscriptions = [
      eventHub.onCustomActionExecuted.subscribe(requestReload),
      eventHub.onContentCreated.subscribe(handleCreate),
      eventHub.onContentCopied.subscribe(handleCreate),
      eventHub.onContentMoved.subscribe(handleCreate),
      eventHub.onContentModified.subscribe(mod => {
        if (children.map(c => c.Id).includes(mod.content.Id)) {
          requestReload()
        }
      }),
      uploadTracker.onUploadProgress.subscribe(({ progress }) => {
        if (progress.completed && progress.createdContent) {
          if (PathHelper.getParentPath(progress.createdContent.Url) === PathHelper.trimSlashes(currentContent.Path)) {
            requestReload()
          }
        }
      }),
      eventHub.onContentDeleted.subscribe(d => {
        if (PathHelper.getParentPath(d.contentData.Path) === PathHelper.trimSlashes(currentContent.Path)) {
          requestReload()
        }
      }),
    ]

    return () => subscriptions.forEach(s => s.dispose())
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
    uploadTracker.onUploadProgress,
  ])

  if (error) {
    throw error
  }

  return <CurrentChildrenContext.Provider value={children}>{props.children}</CurrentChildrenContext.Provider>
}
