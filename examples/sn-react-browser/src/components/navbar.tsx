import { AppBar, Button, Toolbar, Tooltip, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useOidcAuthentication } from '@sensenet/authentication-oidc-react'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
)
/**
 * Navbar component
 */
export const NavBarComponent: React.FunctionComponent = () => {
  const { logout } = useOidcAuthentication()
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Document Browser
          </Typography>
          <Tooltip title="Return to the Login screen and select another repository">
            <Button color="inherit" onClick={() => logout()}>
              Log out
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </div>
  )
}
