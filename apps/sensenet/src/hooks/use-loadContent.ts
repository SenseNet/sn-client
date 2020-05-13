import { ODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { useCallback, useEffect, useState } from 'react'

type Options = {
  idOrPath: string | number
  oDataOptions?: ODataParams<GenericContent>
  isOpened?: boolean
}

export const useLoadContent = <T extends GenericContent>({ idOrPath, oDataOptions, isOpened }: Options) => {
  const [content, setContent] = useState<T>()
  const [error, setError] = useState<Error | undefined>()
  const [reloadToken, setReloadToken] = useState(1)
  const reload = useCallback(() => {
    setReloadToken(Math.random())
  }, [])
  const repo = useRepository()

  useEffect(() => {
    const ac = new AbortController()
    if (idOrPath && idOrPath !== content?.Id && idOrPath !== content?.Path && (isOpened === undefined || isOpened)) {
      ;(async () => {
        try {
          const response = await repo.load<T>({
            idOrPath,
            requestInit: { signal: ac.signal },
            oDataOptions,
          })
          setContent(response.d)
        } catch (err) {
          if (!ac.signal.aborted) {
            setError(err)
          }
        }
      })()
    }
    return () => ac.abort()
  }, [repo, idOrPath, reloadToken, oDataOptions, isOpened, content])

  return { content, error, reload }
}
