import React from 'react'
import { AppBar, Button, Toolbar, Tooltip, Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useRepository } from '@sensenet/hooks-react'

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      flexGrow: 1,
    },
  }),
)

export const NavBarComponent: React.FunctionComponent = () => {
  const repo = useRepository()
  const classes = useStyles()
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Memo application
        </Typography>
        <Tooltip title="Return to the Login screen and select another repository">
          <Button color="inherit" onClick={() => repo.authentication.logout()}>
            Log out
          </Button>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}
