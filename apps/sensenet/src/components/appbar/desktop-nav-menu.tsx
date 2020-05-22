import { useInjector, useRepository } from '@sensenet/hooks-react'
import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Grid, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Typography } from '@material-ui/core'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import clsx from 'clsx'
import { useCurrentUser } from '../../context/current-user-provider'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization, usePersonalSettings } from '../../hooks'
import { PersonalSettings } from '../../services'
import { AntSwitch } from '../ant-switch'
import { useDialog } from '../dialogs'
import { UserAvatar } from '../UserAvatar'
import { applicationPaths } from '../../application-paths'

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
      '& .MuiButtonBase-root': {
        padding: '2px',
        color: theme.palette.type === 'light' ? theme.palette.common.white : theme.palette.common.black,
      },
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
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const currentUser = useCurrentUser()
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

  const prevOpen = useRef(open)
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus()
    }

    prevOpen.current = open
  }, [open])

  const logout = (event: React.MouseEvent<EventTarget>) => {
    openDialog({ name: 'logout' })
    handleClose(event)
  }

  const switchTheme = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    const settings = service.userValue.getValue()
    service.setPersonalSettingsValue({ ...settings, theme: event.target.checked ? 'dark' : 'light' })
  }

  return (
    <div className={clsx(globalClasses.centered, classes.navMenu)}>
      <UserAvatar
        user={currentUser}
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
                      user={currentUser}
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
                      title: currentUser.DisplayName || currentUser.Name,
                    }}
                    primary={`${currentUser.DisplayName || currentUser.Name}`}
                  />
                </MenuItem>
                <NavLink to={applicationPaths.personalSettings} onClick={handleClose}>
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
