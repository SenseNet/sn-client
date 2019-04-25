import { ConstantContent, Repository } from '@sensenet/client-core'
import { debounce } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import Semaphore from 'semaphore-async-await'
import { InjectorContext } from './InjectorContext'
import { RepositoryContext } from './RepositoryContext'

export class CurrentContentService<T extends GenericContent> {
  public currentContent?: T

  public isLoading: boolean = false
  private loadLock = new Semaphore(1)

  public async setContent(idOrPath: number | string, repo: Repository) {
    await this.loadLock.acquire()
    if (this.currentContent && (this.currentContent.Id === idOrPath || this.currentContent.Path === idOrPath)) {
      return
    }
    try {
      this.isLoading = true
      const result = await repo.load<T>({
        idOrPath,
      })
      this.currentContent = result.d
    } finally {
      this.loadLock.release()
      this.isLoading = false
    }
  }
}

export const CurrentContentContext = React.createContext<GenericContent>(ConstantContent.PORTAL_ROOT)

export const CurrentContentProvider: React.FunctionComponent<{
  idOrPath: number | string
}> = props => {
  const [loadLock] = useState(new Semaphore(1))
  const [content, setContent] = useState<GenericContent>(ConstantContent.PORTAL_ROOT)
  const repo = useContext(RepositoryContext)
  const injector = useContext(InjectorContext)
  const [reloadToken, setReloadToken] = useState(1)
  const reload = debounce(() => setReloadToken(Math.random()), 100)

  useEffect(() => {
    const events = injector.getEventHub(repo.configuration.repositoryUrl)
    const subscriptions = [
      events.onContentModified.subscribe(c => {
        if (c.content.Id === content.Id) {
          reload()
        }
      }),
    ]
    return () => subscriptions.forEach(s => s.dispose())
  }, [repo, content])

  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        const response = await repo.load({ idOrPath: props.idOrPath, requestInit: { signal: ac.signal } })
        setContent(response.d)
      } catch (error) {
        if (!ac.signal.aborted) {
          setError(error)
        }
      } finally {
        loadLock.release()
      }
    })()
    return () => ac.abort()
  }, [repo, props.idOrPath, reloadToken])

  if (error) {
    throw error
  }

  return (
    <CurrentContentContext.Provider value={content as GenericContent}>{props.children}</CurrentContentContext.Provider>
  )
}
