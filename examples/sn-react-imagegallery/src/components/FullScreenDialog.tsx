import React from 'react'
import { AppBar, Dialog, IconButton, Toolbar, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import SaveAlt from '@material-ui/icons/SaveAlt'
import { makeStyles } from '@material-ui/core/styles'
import { Transition } from '../app'
import { SelectedImage } from '../Interface'
import { ResponsiveDrawer } from './ResponsiveDrawer'

interface FullScreenprops {
  openedImg: SelectedImage
  isopen: boolean
  closeFunction: () => void
  steppingFunction: (imageIndex: number, openInfoTab: boolean) => void
  imgList: object[]
}

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'visible',
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  appBar: {
    width: '100%',
    marginRight: '0',
  },
}))
/**
 * Display the details view
 */
export const FullScreenDialog: React.FunctionComponent<FullScreenprops> = props => {
  const classes = useStyles()
  return (
    <div>
      <Dialog fullScreen open={props.isopen} onClose={props.closeFunction} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={props.closeFunction} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Image
            </Typography>
            <IconButton edge="start" color="inherit" href={props.openedImg.imgDownloadUrl} aria-label="Close">
              <SaveAlt />
            </IconButton>
          </Toolbar>
        </AppBar>
        <ResponsiveDrawer
          steppingFunction={props.steppingFunction}
          imageListLenght={props.imgList.length}
          imageInfo={props.openedImg}
        />
      </Dialog>
    </div>
  )
}
