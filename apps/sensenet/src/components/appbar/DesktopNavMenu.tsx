import React, { useEffect, useState } from 'react'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import {
  Grid,
  Grow,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Switch,
  Typography,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme, useTheme, withStyles } from '@material-ui/core/styles'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import { useInjector, useRepository, useSession } from '@sensenet/hooks-react'
import { NavLink } from 'react-router-dom'
import { UserAvatar } from '../UserAvatar'
import { useLocalization } from '../../hooks'
import { useDialog } from '../dialogs'
import { PersonalSettings } from '../../services'
import { useThemeService } from '../../hooks/use-theme-service'

const AntSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: 'flex',
    },
    switchBase: {
      padding: 2,
      color: theme.palette.common.white,
      opacity: '1',
      '&$checked': {
        transform: 'translateX(12px)',
        color: theme.palette.common.black,
        '& + $track': {
          opacity: 1,
          backgroundColor: theme.palette.common.white,
        },
      },
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: 'none',
    },
    track: {
      opacity: 1,
    },
    checked: {},
  }),
)(Switch)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100%',
      padding: '8px 16px',
      background: theme.palette.background.paper,
      alignItems: 'center',
    },
    paper: {
      marginRight: theme.spacing(2),
    },
  }),
)

export const DesktopNavMenu: React.FunctionComponent = () => {
  const themeService = useThemeService()
  const injector = useInjector()
  const classes = useStyles()
  const theme = useTheme()
  const service = injector.getInstance(PersonalSettings)
  const { openDialog } = useDialog()
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const session = useSession()
  const repo = useRepository()
  const localization = useLocalization()
  const [pageTheme, setPageTheme] = useState<'dark' | 'light' | undefined>(themeService.currentTheme.getValue())

  useEffect(() => {
    service.setPersonalSettingsTheme(pageTheme)
    themeService.currentTheme.setValue(pageTheme)
  }, [pageTheme, service, themeService.currentTheme])

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }

  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus()
    }

    prevOpen.current = open
  }, [open])

  const logout = (event: React.MouseEvent<EventTarget>) => {
    openDialog({ name: 'logout', props: { userToLogout: session.currentUser } })
    handleClose(event)
  }

  const switchTheme = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageTheme(event.target.checked ? 'dark' : 'light')
  }

  return (
    <div className={classes.root}>
      <UserAvatar user={session.currentUser} repositoryUrl={repo.configuration.repositoryUrl} />
      <IconButton
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        style={{ padding: '0' }}>
        <KeyboardArrowDown />
      </IconButton>
      <Popper
        style={{ top: '65px', left: 'unset', right: '1px', width: 'fit-content' }}
        open={open}
        role={undefined}
        transition
        disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'right top' : 'right bottom',
            }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <UserAvatar user={session.currentUser} repositoryUrl={repo.configuration.repositoryUrl} />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        style: { overflow: 'hidden', textOverflow: 'ellipsis' },
                        title: session.currentUser.DisplayName || session.currentUser.Name,
                      }}
                      primary={`${session.currentUser.DisplayName || session.currentUser.Name} user`}
                    />
                  </MenuItem>
                  <NavLink to="/personalSettings" onClick={handleClose}>
                    <MenuItem style={{ textDecoration: 'underline', color: theme.palette.primary.main }}>
                      {localization.topMenu.personalSettings}
                    </MenuItem>
                  </NavLink>
                  <MenuItem onClick={logout} style={{ textDecoration: 'underline', color: theme.palette.primary.main }}>
                    {localization.topMenu.logout}
                  </MenuItem>
                  <MenuItem>
                    <Typography component="div" style={{ color: theme.palette.primary.main }}>
                      <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item style={{ textTransform: 'uppercase', paddingRight: '32px' }}>
                          {pageTheme === 'dark' ? 'Light theme' : 'Dark theme'}
                        </Grid>
                        <Grid item>
                          <AntSwitch checked={pageTheme === 'dark'} onChange={switchTheme()} />
                        </Grid>
                      </Grid>
                    </Typography>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}
