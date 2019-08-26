import { ConstantContent, ODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useEffect, useState } from 'react'
import Semaphore from 'semaphore-async-await'
import { useRepository, useRepositoryEvents } from '../hooks'

export const CurrentContentContext = React.createContext<GenericContent>(ConstantContent.PORTAL_ROOT)
export const CurrentContentProvider: React.FunctionComponent<{
  idOrPath: number | string
  onContentLoaded?: (content: GenericContent) => void
  oDataOptions?: ODataParams<GenericContent>
}> = props => {
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
    ]
    return () => subscriptions.forEach(s => s.dispose())
  }, [content.Id, events.onContentModified])

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
