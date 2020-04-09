import React from 'react'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { Grid, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import { useInjector, useRepository, useSession } from '@sensenet/hooks-react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { UserAvatar } from '../UserAvatar'
import { useLocalization, usePersonalSettings } from '../../hooks'
import { useDialog } from '../dialogs'
import { PersonalSettings } from '../../services'
import { AntSwitch } from '../ant-switch'
import { globals, useGlobalStyles } from '../../globalStyles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navMenu: {
      height: '100%',
      width: '140px',
      background: theme.palette.background.default,
    },
    paper: {
      marginRight: theme.spacing(2),
    },
    arrowDownIcon: {
      opacity: '87%',
    },
    popperWrapper: {
      position: 'absolute',
      top: globals.common.headerHeight,
      right: '1px',
      height: 'fit-content',
      width: '216px',
    },
    popper: {
      backgroundColor: theme.palette.type === 'light' ? globals.light.navMenuColor : globals.dark.navMenuColor,
      border: theme.palette.type === 'light' ? clsx(globals.light.borderColor, '1px') : 'none',
    },
    listItemIcon: {
      width: '35px',
      height: '35px',
      minWidth: '35px',
    },
    menuItem: {
      textDecoration: 'underline',
      color: theme.palette.primary.main,
      fontSize: '14px',
    },
    themeSwitcher: {
      color: theme.palette.primary.main,
      fontSize: '14px',
    },
  }),
)

export const DesktopNavMenu: React.FunctionComponent = () => {
  const personalSettings = usePersonalSettings()
  const injector = useInjector()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const theme = useTheme()
  const service = injector.getInstance(PersonalSettings)
  const { openDialog } = useDialog()
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const session = useSession()
  const repo = useRepository()
  const localization = useLocalization()

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
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
    <div className={clsx(globalClasses.centered, classes.navMenu)}>
      <UserAvatar
        user={session.currentUser}
        repositoryUrl={repo.configuration.repositoryUrl}
        style={{
          height: '35px',
          width: '35px',
          backgroundColor: theme.palette.primary.main,
          color: globals.common.headerText,
        }}
      />
      <IconButton
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        style={{ padding: 0 }}>
        <KeyboardArrowDown className={classes.arrowDownIcon} />
      </IconButton>
      {open ? (
        <Paper className={classes.popperWrapper}>
          <div className={classes.popper}>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <UserAvatar
                      style={{
                        width: '35px',
                        height: '35px',
                        backgroundColor: theme.palette.primary.main,
                        color: globals.common.headerText,
                      }}
                      user={session.currentUser}
                      repositoryUrl={repo.configuration.repositoryUrl}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      style: {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginLeft: '30px',
                        color: theme.palette.type === 'light' ? globals.light.textColor : globals.dark.textColor,
                      },
                      title: session.currentUser.DisplayName || session.currentUser.Name,
                    }}
                    primary={`${session.currentUser.DisplayName || session.currentUser.Name} user`}
                  />
                </MenuItem>
                <NavLink to="/personalSettings" onClick={handleClose}>
                  <MenuItem className={classes.menuItem}>{localization.topMenu.personalSettings}</MenuItem>
                </NavLink>
                <MenuItem onClick={logout} className={classes.menuItem}>
                  {localization.topMenu.logout}
                </MenuItem>
                <MenuItem>
                  <Typography component="div" className={classes.themeSwitcher}>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item style={{ paddingRight: '32px' }}>
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
          </div>
        </Paper>
      ) : null}
    </div>
  )
}
