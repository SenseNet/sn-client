import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { Created } from '@sensenet/repository-events'
import React, { useContext, useEffect, useState } from 'react'
import Semaphore from 'semaphore-async-await'
import { UploadTracker } from '../services/UploadTracker'
import { CurrentContentContext } from './CurrentContent'
import { InjectorContext } from './InjectorContext'
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
  const uploadTracker = injector.GetInstance(UploadTracker)

  const requestReload = () => setReloadToken(reloadToken + 1)

  useEffect(() => {
    ;(async () => {
      try {
        await loadLock.acquire()
        const childrenResult = await repo.loadCollection<GenericContent>({
          path: currentContent.Path,
          oDataOptions: {
            orderby: [['IsFolder', 'desc']],
            select: 'all',
            expand: 'CreatedBy',
          },
        })
        setChildren(childrenResult.d.results)
      } finally {
        loadLock.release()
      }
    })()
  }, [currentContent.Path, repo, reloadToken])

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
  }, [currentContent, repo])

  return <CurrentChildrenContext.Provider value={children}>{props.children}</CurrentChildrenContext.Provider>
}
