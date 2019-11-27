import React from 'react'

// start of material imports
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
// import AddIcon from '@material-ui/icons/Add'
import LogoutIcon from '@material-ui/icons/PowerSettingsNew'
// end of material imports

// start of sensenet imports
import { useRepository } from '@sensenet/hooks-react'
import { useCurrentUser } from '../hooks/use-current-user'
// end of sensenet imports

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: window.innerWidth,
      height: 35,
    },
    addTaskButton: {
      marginRight: theme.spacing(2),
    },
    logoutButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      // align: 'center',
    },
    userName: {
      flexGrow: 1,
    },
  }),
)

const HeaderPanel = () => {
  const usr = useCurrentUser()
  const repo = useRepository() // Custom hook that will return with a Repository object
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {usr ? usr.DisplayName : ''}
          </Typography>
          <IconButton
            edge="start"
            className={classes.logoutButton}
            color="inherit"
            aria-label="logout"
            onClick={() => repo.authentication.logout()}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default HeaderPanel
