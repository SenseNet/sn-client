import { useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useEffect, useState } from 'react'
import { ensureFavoritesRoot } from '../../services/favorites'
import { FAVORITES_ROOT_PATH } from '../../services/favorites-constants'
import { Content } from '../content'
import { FullScreenLoader } from '../full-screen-loader'

const Favorites = () => {
  const repository = useRepository()
  const logger = useLogger('favorites')
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        await ensureFavoritesRoot(repository)
        if (mounted) {
          setIsReady(true)
        }
      } catch (ensureError) {
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
    }
  }, [logger, repository])

  if (error) {
    throw error
  }

  if (!isReady) {
    return <FullScreenLoader />
  }

  return <Content rootPath={FAVORITES_ROOT_PATH} />
}

export default Favorites
