import { useOidcAuthentication } from '@sensenet/authentication-oidc-react'
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
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
          <Button color="inherit" onClick={logout}>
            Log out
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}
