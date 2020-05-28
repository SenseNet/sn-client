// start of material imports
import { useOidcAuthentication } from '@sensenet/authentication-oidc-react'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import LogoutIcon from '@material-ui/icons/PowerSettingsNew'
import React from 'react'
// end of material imports

// start of sensenet imports
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
    },
    userName: {
      flexGrow: 1,
    },
  }),
)

const HeaderPanel = () => {
  const { logout, oidcUser } = useOidcAuthentication()
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {oidcUser?.profile.name}
            &apos;s Task
          </Typography>
          <IconButton
            edge="start"
            className={classes.logoutButton}
            color="inherit"
            aria-label="logout"
            onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default HeaderPanel
