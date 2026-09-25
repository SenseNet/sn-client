import { useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useEffect, useState } from 'react'
import { useLocalization } from '../../hooks'
import { isFavoriteRequestAborted } from '../../services/favorites'
import { FAVORITES_ROOT_PATH } from '../../services/favorites-constants'
import { Content } from '../content'
import { FullScreenLoader } from '../full-screen-loader'

const Favorites = () => {
  const repository = useRepository()
  const logger = useLogger('favorites')
  const localization = useLocalization()
  const [isReady, setIsReady] = useState(false)
  const [isMissing, setIsMissing] = useState(false)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()
    setIsReady(false)
    setIsMissing(false)
    setError(undefined)
    ;(async () => {
      try {
        await repository.load({
          idOrPath: FAVORITES_ROOT_PATH,
          requestInit: { signal: controller.signal },
          oDataOptions: { select: ['Id', 'Path', 'Name', 'Type'] },
        })
        if (mounted) {
          setIsReady(true)
        }
      } catch (ensureError) {
        if (!mounted || controller.signal.aborted || isFavoriteRequestAborted(ensureError)) return
        if ((ensureError as { statusCode?: number }).statusCode === 404) {
          setIsMissing(true)
          setIsReady(true)
          return
        }
        logger.error({
          message: 'Could not initialize Favorites.',
          data: { error: ensureError },
        })
        if (mounted) {
          setError(ensureError as Error)
        }
      }
    })()

    return () => {
      mounted = false
      controller.abort()
    }
  }, [logger, repository])

  if (error) {
    throw error
  }

  if (!isReady) {
    return <FullScreenLoader />
  }

  if (isMissing) return <div role="status">{localization.contentViews.empty}</div>

  return <Content rootPath={FAVORITES_ROOT_PATH} />
}

export default Favorites
