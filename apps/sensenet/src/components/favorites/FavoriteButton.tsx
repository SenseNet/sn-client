import { Button, ListItemIcon } from '@material-ui/core'
import { Star, StarBorder } from '@material-ui/icons'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useContext } from 'react'
import { useFavoriteState } from '../../hooks/use-favorite-state'
import { FAVORITES_ROOT_PATH } from '../../services/favorites-constants'
import { ExpandItemsContext } from '../tree/Contexts/ExpandedItemsProvider'

type FavoriteButtonProps = {
  content: GenericContent
}

export const FavoriteButton = ({ content }: FavoriteButtonProps) => {
  const expContext = useContext(ExpandItemsContext)
  const deleteTreeCache = expContext?.[6]
  const { available, isFavorite, isBusy, toggle: toggleState } = useFavoriteState(content)

  const toggle = async () => {
    const result = await toggleState()
    if (result !== undefined) {
      deleteTreeCache?.(FAVORITES_ROOT_PATH)
    }
  }

  if (!available) {
    return null
  }

  return (
    <Button key="Favorites" title="Favorites" disableRipple={true} disabled={isBusy} onClick={toggle}>
      <ListItemIcon>{isFavorite ? <Star color="primary" /> : <StarBorder />}</ListItemIcon>
      <div style={{ flexGrow: 1 }}>Favorites</div>
    </Button>
  )
}
