import { Image } from '@sensenet/default-content-types'
import { Button, GridList, GridListTile, makeStyles, useMediaQuery, useTheme } from '@material-ui/core'
import { AddCircle } from '@material-ui/icons'
import React, { useState } from 'react'
import { GridListItem, GridListItemProps } from './grid-list-item'
import { UploadDialog } from './upload-dialog'

export const GRID_ITEM_SIZE = 150

export const useStyles = makeStyles(() => ({
  item: {
    margin: '2rem 0',
  },
  addButton: {
    maxWidth: GRID_ITEM_SIZE,
    height: '100%',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    textTransform: 'none',
  },
}))
interface AdvancedGridListProps extends Pick<GridListItemProps, 'openFunction'> {
  imgList: Image[]
  requestReload: () => void
}

export const AdvancedGridList: React.FunctionComponent<AdvancedGridListProps> = (props) => {
  const classes = useStyles()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'))
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  return (
    <GridList cellHeight={GRID_ITEM_SIZE} cols={isDesktop ? 4 : isMobile ? 2 : 3}>
      <GridListTile className={classes.item}>
        <Button
          variant="contained"
          color="primary"
          className={classes.addButton}
          startIcon={<AddCircle />}
          onClick={() => setUploadDialogOpen(true)}>
          Add Images
        </Button>
        <UploadDialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          uploadCallback={() => props.requestReload()}
        />
      </GridListTile>
      {props.imgList.map((tile, index) => (
        <GridListItem
          key={tile.Id}
          tile={tile}
          index={index}
          openFunction={props.openFunction}
          className={classes.item}
          requestReload={props.requestReload}
        />
      ))}
    </GridList>
  )
}
