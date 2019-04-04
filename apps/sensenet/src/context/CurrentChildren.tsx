import { debounce, PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { Created } from '@sensenet/repository-events'
import React, { useContext, useEffect, useState } from 'react'
import Semaphore from 'semaphore-async-await'
import { UploadTracker } from '../services/UploadTracker'
import { CurrentContentContext } from './CurrentContent'
import { InjectorContext } from './InjectorContext'
import { LoadSettingsContext } from './LoadSettingsContext'
import { RepositoryContext } from './RepositoryContext'
export const CurrentChildrenContext = React.createContext<GenericContent[]>([])

export const CurrentChildrenProvider: React.FunctionComponent = props => {
  const currentContent = useContext(CurrentContentContext)
  const injector = useContext(InjectorContext)
  const [children, setChildren] = useState<GenericContent[]>([])
  const [loadLock] = useState(new Semaphore(1))

  const [reloadToken, setReloadToken] = useState(1)
  const repo = useContext(RepositoryContext)
  const eventHub = injector.getEventHub(repo.configuration.repositoryUrl)
  const uploadTracker = injector.getInstance(UploadTracker)
  const loadSettings = useContext(LoadSettingsContext)

  const requestReload = debounce(() => setReloadToken(Math.random()), 200)

  useEffect(() => {
    ;(async () => {
      try {
        await loadLock.acquire()
        const childrenResult = await repo.loadCollection<GenericContent>({
          path: currentContent.Path,
          oDataOptions: loadSettings.loadChildrenSettings,
        })
        setChildren(childrenResult.d.results)
      } finally {
        loadLock.release()
      }
    })()
  }, [currentContent.Path, loadSettings.loadChildrenSettings, repo, reloadToken])

  const handleCreate = (c: Created) => {
    if ((c.content as GenericContent).ParentId === currentContent.Id) {
      requestReload()
    }
    if (parent && PathHelper.isAncestorOf(currentContent.Path, c.content.Path)) {
      requestReload()
    }
  }

  useEffect(() => {
    const subscriptions = [
      eventHub.onContentCreated.subscribe(handleCreate),
      eventHub.onContentCopied.subscribe(handleCreate),
      eventHub.onContentMoved.subscribe(handleCreate),
      eventHub.onContentModified.subscribe(mod => {
        if (children.map(c => c.Id).includes(mod.content.Id)) {
          requestReload()
        }
      }),
      uploadTracker.onUploadProgress.subscribe(pr => {
        if (pr.completed && pr.createdContent) {
          if (PathHelper.getParentPath(pr.createdContent.Url) === PathHelper.trimSlashes(currentContent.Path)) {
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
  }, [currentContent, repo, children])

  return <CurrentChildrenContext.Provider value={children}>{props.children}</CurrentChildrenContext.Provider>
}
