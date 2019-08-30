import { useEffect, useState } from 'react'
import { GenericContent } from '@sensenet/default-content-types'
import { ODataParams } from '@sensenet/client-core'
import { useRepository } from '.'

type Options = {
  idOrPath: string | number
  oDataOptions?: ODataParams<GenericContent>
}

export const useLoadContent = <T extends GenericContent>({ idOrPath, oDataOptions }: Options) => {
  const [content, setContent] = useState<T>()
  const [error, setError] = useState<Error | undefined>()
  const [reloadToken, setReloadToken] = useState(1)
  const reload = () => setReloadToken(Math.random())
  const repo = useRepository()

  useEffect(() => {
    const ac = new AbortController()
    if (idOrPath) {
      ;(async () => {
        try {
          const response = await repo.load<T>({
            idOrPath,
            requestInit: { signal: ac.signal },
            oDataOptions,
          })
          setContent(response.d)
          // props.onContentLoaded && props.onContentLoaded(response.d)
        } catch (err) {
          if (!ac.signal.aborted) {
            setError(err)
          }
        }
      })()
    }
    return () => ac.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo, idOrPath, reloadToken])

  return { content, error, reload }
}
