/* eslint-disable require-jsdoc */
import React from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Divider, Drawer, Typography } from '@material-ui/core'
import Person from '@material-ui/icons/Person'
import { makeStyles } from '@material-ui/core/styles'
import { SelectedImage } from '../Interface'
import { DotsMobileStepper } from './DotsMobileStepper'

const drawerWidth = 240

interface ResponsiveProps {
  imageInfo: SelectedImage
  steppingFunction: (imageIndex: number, openInfoTab: boolean) => void
  imageListLenght: number
}

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'visible',
    backgroundColor: theme.palette.background.paper,
  },
  drawerMain: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      right: '0',
    },
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      right: drawerWidth,
    },
    display: 'block',
    height: '100%',
  },
  imgTileFullSize: {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxHeight: '84vh',
    flexDirection: 'row',
    marginTop: '60px',
  },
  selectedImgContent: {
    width: '100%',
    height: '94vh',
    display: 'flex',
    alignItems: 'center',
  },
  drawer: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
    },
    flexShrink: 0,
  },
  drawerPaper: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      display: 'block',
      position: 'relative',
    },
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
    },
    zIndex: 1099,
  },
  toolbar: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    display: 'none',
    marginTop: '64px',
  },
  defaultAvatarimg: {
    marginBottom: '-5px',
  },
  avatarImg: {
    height: '24px',
    width: '24px',
    borderRadius: '50%',
    marginLeft: '5px',
  },
}))
export const ResponsiveDrawer: React.FunctionComponent<ResponsiveProps> = (props) => {
  const classes = useStyles()
  const matches = useMediaQuery('(min-width:600px)')
  return (
    <div className={classes.root}>
      <main className={classes.drawerMain}>
        <div className={classes.selectedImgContent}>
          <img className={classes.imgTileFullSize} src={props.imageInfo.imgPath} alt={props.imageInfo.imgPath} />
        </div>
        <DotsMobileStepper
          steppingFunction={props.steppingFunction}
          imageIndex={props.imageInfo.imgIndex}
          imageListLenght={props.imageListLenght}
        />
      </main>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor={matches ? 'right' : 'bottom'}>
        <div className={classes.toolbar} />
        <Divider />
        <Typography>Name: {props.imageInfo.imgTitle}</Typography>
        <Typography>Descripton: {props.imageInfo.imgDescription}</Typography>
        <Typography>
          Author: {props.imageInfo.imgAuthor}
          {props.imageInfo.imgAuthorAvatar !== '' ? (
            <img className={classes.avatarImg} src={props.imageInfo.imgAuthorAvatar} alt={props.imageInfo.imgPath} />
          ) : (
            <Person className={classes.defaultAvatarimg} />
          )}
        </Typography>
        <Typography>Created: {props.imageInfo.imgCreationDate}</Typography>
        <Typography>Size: {props.imageInfo.imgSize}</Typography>
        <Divider />
      </Drawer>
    </div>
  )
}
