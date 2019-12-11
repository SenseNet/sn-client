import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { UploadControll } from './UploadControll'
interface SimpleAppBarProps {
  uploadsetdata: () => void
  notificationControll: (isOpen: boolean) => void
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
      position: 'fixed',
      zIndex: 1,
    },
    button: {
      margin: theme.spacing(1),
      float: 'right',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    appBar: {
      width: '100%',
      marginRight: '0',
    },
  }),
)
/**
 * Display the header
 */
export const SimpleAppBar: React.FunctionComponent<SimpleAppBarProps> = props => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Photos
          </Typography>
          <UploadControll uploadsetdata={props.uploadsetdata} notificationControll={props.notificationControll} />
        </Toolbar>
      </AppBar>
    </div>
  )
}
