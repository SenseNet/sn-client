import { Image, User } from '@sensenet/default-content-types'
import { ConstantContent } from '@sensenet/client-core'
import { useRepository } from '@sensenet/hooks-react'
import React, { useState } from 'react'
import { IconButton } from '@material-ui/core'
import GridList from '@material-ui/core/GridList'
import { makeStyles } from '@material-ui/core/styles'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import { DropFileArea } from './DropFileArea'

interface AdvancedGridprops {
  imgList: Image[]
  uploadsetdata: () => void
  notificationControll: (IsOpen: boolean) => void
}

export const useStyles = makeStyles((theme) => ({
  root: {
    width: '75%',
    justifyContent: 'space-around',
    overflow: 'visible',
    backgroundColor: theme.palette.background.paper,
    marginTop: '100px',
  },
  gridList: {
    height: 'auto',
    transform: 'translateZ(0)',
  },
  imgTile: {
    cursor: 'default',
  },
  icon: {
    color: 'white',
  },
  titleBar: {
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}))
/**
 * Determines which image should be full width
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
  const [isDragOver, setDragOver] = useState(false)
  const classes = useStyles()
  const repo = useRepository()
  /**
   * Sets the isDragOver state true or false
   * @param {boolean} isOpen Seletected number's index.
   */
  function DragSetter(isOpen: boolean) {
    setDragOver(isOpen)
  }

  return (
    <div className={classes.root}>
      <DropFileArea
        uploadPath={`${ConstantContent.PORTAL_ROOT.Path}/Content/IT/ImageLibrary`}
        uploadsetdata={props.uploadsetdata}
        notificationControll={props.notificationControll}
        setDragOver={DragSetter}
        isDragOver={isDragOver}>
        <GridList cellHeight={200} spacing={1} style={{ opacity: isDragOver ? 0.5 : 1 }} className={classes.gridList}>
          {props.imgList.map((tile, index) => (
            <GridListTile key={tile.Id} cols={pickTile(index)} rows={pickTile(index)}>
              <img
                className={classes.imgTile}
                src={repo.configuration.repositoryUrl + tile.Path}
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
      </DropFileArea>
    </div>
  )
}
