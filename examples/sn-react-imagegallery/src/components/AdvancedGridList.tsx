import { Image, User } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { IconButton } from '@material-ui/core'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

interface AdvancedGridprops {
  openFunction: (imageIndex: number, openInfoTab: boolean) => void
  imgList: Image[]
}

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'visible',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
    height: 'auto',
    transform: 'translateZ(0)',
  },
  imgTile: {
    cursor: 'pointer',
  },
  icon: {
    color: 'white',
  },
  titleBar: {
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}))

/**
 * Determines which image should be full width sized
 * @param {number} anumber Seletected number's index.
 * @returns {int} 2 for full width, 1 for half size.
 */
export function pickTile(anumber: number) {
  let tilenumber = anumber % 3
  tilenumber = tilenumber === 0 ? 2 : 1
  return tilenumber
}

/**
 * Display Images from repository
 */
export const AdvancedGridList: React.FunctionComponent<AdvancedGridprops> = (props) => {
  const classes = useStyles()
  const repo = useRepository()

  return (
    <div className={classes.root}>
      <GridList cellHeight={200} spacing={1} className={classes.gridList}>
        {props.imgList.map((tile, index) => (
          <GridListTile key={tile.Id} cols={pickTile(index)} rows={pickTile(index)}>
            <img
              className={classes.imgTile}
              src={repo.configuration.repositoryUrl + tile.Path}
              onClick={() => props.openFunction(index, true)}
              alt={tile.Description}
            />
            <GridListTileBar
              title={tile.DisplayName}
              titlePosition="bottom"
              subtitle={<span>by: {(tile.CreatedBy as User).FullName}</span>}
              actionIcon={<IconButton aria-label={`star ${tile.DisplayName}`} className={classes.icon} />}
              actionPosition="left"
              className={classes.titleBar}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  )
}
