import { Grid, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Typography } from '@material-ui/core'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import { TuneOutlined } from '@material-ui/icons'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import { Switch } from '@sensenet/controls-react'
import { useInjector, useRepository } from '@sensenet/hooks-react'
import { clsx } from 'clsx'
import React, { ChangeEvent, Dispatch, FunctionComponent, SetStateAction, useState } from 'react'
import { Link } from 'react-router-dom'
import { PATHS, resolvePathParams } from '../../application-paths'
import { useCurrentUser } from '../../context/current-user-provider'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization, usePersonalSettings } from '../../hooks'
import { pathWithQueryParams, PersonalSettings } from '../../services'
import { useDialog } from '../dialogs'
import { UserAvatar } from '../UserAvatar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    viewOptions: {
      cursor: 'pointer',
      marginRight: '16px',
    },
    navMenu: {
      height: '100%',
      width: '140px',
      background: theme.palette.background.default,
    },
    paper: {
      marginRight: theme.spacing(2),
    },
    icon: {
      opacity: '87%',
    },
    iconButton: {
      padding: '0',
    },
    popperUserWrapper: {
      position: 'absolute',
      top: globals.common.headerHeight,
      right: '1px',
      height: 'fit-content',
      width: '216px',
    },
    popperViewWrapper: {
      position: 'absolute',
      top: globals.common.headerHeight,
      right: '1px',
      height: 'fit-content',
      width: '300px',
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
    userMenuItem: {
      textDecoration: 'underline',
      color: theme.palette.primary.main,
      fontSize: '14px',
    },
    checkboxMenuItem: {
      color: theme.palette.primary.main,
      fontSize: '14px',
      '& .MuiButtonBase-root': {
        padding: '2px',
        color: theme.palette.type === 'light' ? theme.palette.common.white : theme.palette.common.black,
      },
    },
  }),
)

export const DesktopNavMenu: FunctionComponent = () => {
  const personalSettings = usePersonalSettings()
  const injector = useInjector()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const theme = useTheme()
  const service = injector.getInstance(PersonalSettings)
  const currentUser = useCurrentUser()
  const repo = useRepository()
  const localization = useLocalization()
  const { openDialog } = useDialog()
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const [openViewOptions, setOpenViewOptions] = useState(false)

  const handleToggle = (setter: Dispatch<SetStateAction<boolean>>) => {
    setter((prevState) => !prevState)
  }

  const handleClose = (setter: Dispatch<SetStateAction<boolean>>) => {
    setter(false)
  }

  const logout = () => {
    openDialog({ name: 'logout' })
    handleClose(setOpenUserMenu)
  }

  const changePassword = async () => {
    openDialog({ name: 'change-password' })
    handleClose(setOpenUserMenu)
  }

  const switchTheme = () => (event: ChangeEvent<HTMLInputElement>) => {
    const settings = service.userValue.getValue()
    service.setPersonalSettingsValue({ ...settings, theme: event.target.checked ? 'dark' : 'light' })
  }

  const toggleHideSettingsFolder = () => (event: ChangeEvent<HTMLInputElement>) => {
    const settings = service.userValue.getValue()
    service.setPersonalSettingsValue({ ...settings, showHiddenItems: event.target.checked })
  }

  const togglePreferDisplayNameValue = () => (event: ChangeEvent<HTMLInputElement>) => {
    const settings = service.userValue.getValue()
    service.setPersonalSettingsValue({ ...settings, preferDisplayName: event.target.checked })
  }

  return (
    <div className={clsx(globalClasses.centered, classes.navMenu)}>
      <>
        <IconButton
          aria-label={localization.topMenu.openViewOptions}
          aria-controls={openViewOptions ? 'menu-list-grow' : undefined}
          className={classes.viewOptions}
          onClick={() => handleToggle(setOpenViewOptions)}>
          <TuneOutlined />
        </IconButton>
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
          data-test="user-menu-button"
          aria-label={localization.topMenu.openUserMenu}
          aria-controls={openUserMenu ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={() => handleToggle(setOpenUserMenu)}
          className={classes.iconButton}>
          <KeyboardArrowDown className={classes.icon} />
        </IconButton>
      </>
      {openUserMenu ? (
        <Paper className={classes.popperUserWrapper}>
          <div className={classes.popper}>
            <ClickAwayListener onClickAway={() => handleClose(setOpenUserMenu)}>
              <MenuList autoFocusItem={openUserMenu} id="menu-list-grow">
                <MenuItem onClick={() => handleClose(setOpenUserMenu)}>
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
                        marginLeft: '20px',
                        color: theme.palette.type === 'light' ? globals.light.textColor : globals.dark.textColor,
                      },
                      title: `Full-name: ${currentUser.DisplayName}` || currentUser.Name,
                    }}
                    secondaryTypographyProps={{
                      style: {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginLeft: '20px',
                        color: theme.palette.type === 'light' ? globals.light.textColor : globals.dark.textColor,
                      },
                      title: `Login-name: ${currentUser.LoginName}` || currentUser.Name,
                    }}
                    primary={`${currentUser.DisplayName || currentUser.Name}`}
                    secondary={`${currentUser.LoginName || currentUser.Name}`}
                  />
                </MenuItem>
                <MenuItem className={classes.userMenuItem}>
                  <Link
                    onClick={() => handleClose(setOpenUserMenu)}
                    to={pathWithQueryParams({
                      path: resolvePathParams({
                        path: PATHS.usersAndGroups.appPath,
                        params: { browseType: 'explorer', action: 'edit' },
                      }),
                      newParams: {
                        content: currentUser.Path,
                        needRoot: 'false',
                      },
                    })}>
                    {localization.topMenu.accountSettings}
                  </Link>
                </MenuItem>
                <MenuItem data-test="change-password-menu" onClick={changePassword} className={classes.userMenuItem}>
                  {localization.topMenu.changePassword}
                </MenuItem>
                <MenuItem onClick={logout} className={classes.userMenuItem}>
                  {localization.topMenu.logout}
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </div>
        </Paper>
      ) : null}
      {openViewOptions ? (
        <Paper className={classes.popperViewWrapper}>
          <div className={classes.popper}>
            <ClickAwayListener onClickAway={() => handleClose(setOpenViewOptions)}>
              <MenuList autoFocusItem={openViewOptions} id="menu-list-grow">
                <MenuItem onClick={() => handleClose(setOpenViewOptions)}>
                  <Typography component="div" style={{ margin: '0 auto' }}>
                    {localization.topMenu.viewOptions}
                  </Typography>
                </MenuItem>
                <MenuItem>
                  <Typography component="div" className={classes.checkboxMenuItem} style={{ width: '100%' }}>
                    <Grid component="label" container alignItems="center" justify="space-between">
                      <Grid item style={{ paddingRight: '16px' }} data-test="theme-status">
                        {personalSettings.theme === 'dark' ? 'Light theme' : 'Dark theme'}
                      </Grid>
                      <Grid item>
                        <Switch
                          data-test="theme-switcher"
                          checked={personalSettings.theme === 'dark'}
                          onChange={switchTheme()}
                        />
                      </Grid>
                    </Grid>
                  </Typography>
                </MenuItem>
                <MenuItem>
                  <Typography component="div" className={classes.checkboxMenuItem} style={{ width: '100%' }}>
                    <Grid component="label" container alignItems="center" justify="space-between">
                      <Grid item style={{ paddingRight: '16px' }}>
                        {localization.topMenu.showHiddenItems}
                      </Grid>
                      <Grid item>
                        <Switch
                          data-test="hide-settings-folder-checkbox"
                          checked={personalSettings.showHiddenItems}
                          onChange={toggleHideSettingsFolder()}
                        />
                      </Grid>
                    </Grid>
                  </Typography>
                </MenuItem>
                <MenuItem>
                  <Typography component="div" className={classes.checkboxMenuItem} style={{ width: '100%' }}>
                    <Grid component="label" container alignItems="center" justify="space-between">
                      <Grid item style={{ paddingRight: '16px' }}>
                        {localization.topMenu.preferDisplayName}
                      </Grid>
                      <Grid item>
                        <Switch
                          data-test="prefer-display-name-checkbox"
                          checked={personalSettings.preferDisplayName}
                          onChange={togglePreferDisplayNameValue()}
                        />
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
