import { GridListTile, GridListTileBar, makeStyles, Slide, useMediaQuery, useTheme } from '@material-ui/core'
import { Image } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { DetailedHTMLProps, FunctionComponent, StyleHTMLAttributes, useState } from 'react'
import { GRID_ITEM_SIZE } from './advanced-grid-list'
import { DeleteConfirm } from './delete-confirm'

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    maxWidth: GRID_ITEM_SIZE,
    position: 'relative',
    margin: '0 auto',
  },
  imgTile: {
    width: '100%',
    height: GRID_ITEM_SIZE,
    objectFit: 'cover',
    cursor: 'pointer',
  },
  icon: {
    color: theme.palette.common.white,
    padding: 8,
  },
  titleBar: {
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  muiTitleWrap: {
    marginLeft: 8,
    marginRight: 8,
  },
}))

export interface GridListItemProps {
  index: number
  tile: Image
  openFunction: (imageIndex: number, openInfoTab: boolean) => void
  className?: string
  style?: DetailedHTMLProps<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>
  requestReload: () => void
}

export const GridListItem: FunctionComponent<GridListItemProps> = ({
  tile,
  openFunction,
  index,
  className,
  style,
  requestReload,
}) => {
  const repo = useRepository()
  const classes = useStyles()
  const [isHovered, setIsHovered] = useState(false)
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <GridListTile className={className} style={style}>
      <div className={classes.wrapper} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <img
          className={classes.imgTile}
          src={repo.configuration.repositoryUrl + tile.Path}
          onClick={() => openFunction(index, true)}
          alt={tile.Description}
        />

        <Slide direction="up" in={isDesktop ? isHovered : true} mountOnEnter unmountOnExit>
          <GridListTileBar
            title={tile.DisplayName}
            titlePosition="bottom"
            subtitle={tile.Description}
            actionIcon={
              <DeleteConfirm
                tile={tile}
                cancelCallback={() => setIsHovered(false)}
                deleteCallback={() => {
                  requestReload()
                  setIsHovered(false)
                }}
              />
            }
            actionPosition="right"
            className={classes.titleBar}
            classes={{ titleWrap: classes.muiTitleWrap }}
          />
        </Slide>
      </div>
    </GridListTile>
  )
}
