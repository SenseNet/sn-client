import React from 'react'
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
  Typography,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import { useInjector, useRepository, useSession } from '@sensenet/hooks-react'
import { NavLink } from 'react-router-dom'
import { UserAvatar } from '../UserAvatar'
import { useLocalization, usePersonalSettings } from '../../hooks'
import { useDialog } from '../dialogs'
import { PersonalSettings } from '../../services'
import { AntSwitch } from '../../components/ant-switch'

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
  const personalSettings = usePersonalSettings()
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
    const settings = service.userValue.getValue()
    service.setPersonalSettingsValue({ ...settings, theme: event.target.checked ? 'dark' : 'light' })
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
                          {personalSettings.theme === 'dark' ? 'Light theme' : 'Dark theme'}
                        </Grid>
                        <Grid item>
                          <AntSwitch checked={personalSettings.theme === 'dark'} onChange={switchTheme()} />
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
