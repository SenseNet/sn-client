import React, { useEffect, useState } from 'react'

// start of material imports
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import LogoutIcon from '@material-ui/icons/PowerSettingsNew'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
// end of material imports

// start of sensenet imports
import { ODataResponse } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { useOidcAuthentication } from '@sensenet/authentication-oidc-react'
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
  const repo = useRepository() // Custom hook that will return with a Repository object
  const { logout, oidcUser } = useOidcAuthentication()
  const classes = useStyles()
  const [container, setContainer] = useState<GenericContent>()

  useEffect(() => {
    /**
     * load from repo
     */
    async function loadContent() {
      const result: ODataResponse<GenericContent> = await repo.load({
        idOrPath: `/Root/Content/IT/Tasks`,
      })
      setContainer(result.d)
    }
    loadContent()
  }, [repo])

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {oidcUser?.profile.name}
            {container !== undefined ? `'s ${container.DisplayName}` : ''}
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
