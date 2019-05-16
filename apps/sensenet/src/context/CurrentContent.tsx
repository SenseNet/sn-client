import { ConstantContent } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import Semaphore from 'semaphore-async-await'
import { InjectorContext } from './InjectorContext'
import { RepositoryContext } from './RepositoryContext'

export const CurrentContentContext = React.createContext<GenericContent>(ConstantContent.PORTAL_ROOT)
export const CurrentContentProvider: React.FunctionComponent<{
  idOrPath: number | string
  onContentLoaded?: (content: GenericContent) => void
}> = props => {
  const [loadLock] = useState(new Semaphore(1))
  const [content, setContent] = useState<GenericContent>(ConstantContent.PORTAL_ROOT)
  const repo = useContext(RepositoryContext)
  const injector = useContext(InjectorContext)
  const [reloadToken, setReloadToken] = useState(1)
  const reload = () => setReloadToken(Math.random())

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
    if (props.idOrPath) {
      ;(async () => {
        try {
          const response = await repo.load({ idOrPath: props.idOrPath, requestInit: { signal: ac.signal } })
          setContent(response.d)
          props.onContentLoaded && props.onContentLoaded(response.d)
        } catch (error) {
          if (!ac.signal.aborted) {
            setError(error)
          }
        } finally {
          loadLock.release()
        }
      })()
    }
    return () => ac.abort()
  }, [repo, props.idOrPath, reloadToken])

  if (error) {
    throw error
  }

  return (
    <CurrentContentContext.Provider value={content as GenericContent}>{props.children}</CurrentContentContext.Provider>
  )
}
