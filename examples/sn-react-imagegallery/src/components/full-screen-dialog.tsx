import { Image } from '@sensenet/default-content-types'
import { AppBar, Dialog, IconButton, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import React from 'react'
import { Transition } from '../app'
import { ImageGallery } from './image-gallery'

export interface FullScreenDialogProps {
  openedImage: Image
  open: boolean
  closeFunction: () => void
  steppingFunction: (imageIndex: number, openInfoTab: boolean) => void
  imgList: Image[]
  handleDelete: (deletedItem: Image) => void
}

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'visible',
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    marginLeft: theme.spacing(1),
  },
  appBar: {
    width: '100%',
    marginRight: '0',
  },
}))

export const FullScreenDialog: React.FunctionComponent<FullScreenDialogProps> = (props) => {
  const classes = useStyles()

  return (
    <div>
      <Dialog fullScreen open={props.open} onClose={props.closeFunction} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={props.closeFunction} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <div className={classes.title}>Image</div>
          </Toolbar>
        </AppBar>
        <ImageGallery
          steppingFunction={props.steppingFunction}
          handleDelete={props.handleDelete}
          openedImage={props.openedImage}
        />
      </Dialog>
    </div>
  )
}
