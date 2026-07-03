import { Button, ListItemIcon } from '@material-ui/core'
import { Star, StarBorder } from '@material-ui/icons'
import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useState } from 'react'
import { addFavorite, isFavoriteRootPath, loadFavoriteLink, removeFavorite } from '../../services/favorites'
import { FAVORITES_ROOT_PATH } from '../../services/favorites-constants'
import { ExpandItemsContext } from '../tree/Contexts/ExpandedItemsProvider'

type FavoriteButtonProps = {
  content: GenericContent
}

export const FavoriteButton = ({ content }: FavoriteButtonProps) => {
  const repository = useRepository()
  const logger = useLogger('favorite-button')
  const expContext = useContext(ExpandItemsContext)
  const deleteTreeCache = expContext?.[6]
  const [isFavorite, setIsFavorite] = useState(false)
  const [isBusy, setIsBusy] = useState(false)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const favoriteLink = await loadFavoriteLink(repository, content)
        if (mounted) {
          setIsFavorite(Boolean(favoriteLink))
        }
      } catch (error) {
        logger.warning({
          message: 'Could not check favorite state.',
          data: { error, content },
        })
      }
    })()

    return () => {
      mounted = false
    }
  }, [content, logger, repository])

  const toggle = async () => {
    if (isBusy) {
      return
    }

    setIsBusy(true)

    try {
      const nextState = isFavorite
        ? await (async () => {
            await removeFavorite(repository, content)
            return false
          })()
        : await (async () => {
            await addFavorite(repository, content)
            return true
          })()

      setIsFavorite(nextState)
      deleteTreeCache?.(FAVORITES_ROOT_PATH)
    } catch (error) {
      logger.error({
        message: 'Could not toggle favorite state.',
        data: { error, content },
      })
    } finally {
      setIsBusy(false)
    }
  }

  if (isFavoriteRootPath(content.Path)) {
    return null
  }

  return (
    <Button key="Favorites" title="Favorites" disableRipple={true} disabled={isBusy} onClick={toggle}>
      <ListItemIcon>{isFavorite ? <Star color="primary" /> : <StarBorder />}</ListItemIcon>
      <div style={{ flexGrow: 1 }}>Favorites</div>
    </Button>
  )
}
