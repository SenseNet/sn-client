import { Grid, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Typography } from '@material-ui/core'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import { ExitToApp, LockOutlined, PersonOutline, TuneOutlined } from '@material-ui/icons'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import { Switch } from '@sensenet/controls-react'
import { useInjector, useRepository } from '@sensenet/hooks-react'
import { clsx } from 'clsx'
import React, { ChangeEvent, Dispatch, FunctionComponent, SetStateAction, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { PATHS, resolvePathParams } from '../../application-paths'
import { useAuth } from '../../context/auth-provider'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization, usePersonalSettings } from '../../hooks'
import {
  ContentIconSize,
  ContentIconSizes,
  ContentViewMode,
  ContentViewModes,
  pathWithQueryParams,
  PersonalSettings,
  PersonalSettingsType,
} from '../../services'
import { useDialog } from '../dialogs'
import { UserAvatar } from '../UserAvatar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    viewOptions: {
      cursor: 'pointer',
      marginRight: '16px',
      padding: '7px',
      [theme.breakpoints.down('sm')]: {
        marginRight: '6px',
      },
    },
    navMenu: {
      height: '100%',
      width: '140px',
      background: theme.palette.background.default,
      flex: '0 0 auto',
      [theme.breakpoints.down('sm')]: {
        width: '112px',
      },
    },
    navMenuCompact: {
      width: '76px',
      [theme.breakpoints.down('sm')]: {
        width: '70px',
      },
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
      width: '340px',
      maxWidth: 'calc(100vw - 16px)',
      maxHeight: `calc(100vh - ${globals.common.headerHeight + 8}px)`,
      overflowY: 'auto',
      overscrollBehavior: 'contain',
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
      minHeight: '42px',
      margin: theme.spacing(0.5, 1),
      padding: theme.spacing(1, 1.5),
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.text.primary,
      fontSize: '14px',
      '&:hover, &:focus': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    userMenuActionIcon: {
      minWidth: '34px',
      color: theme.palette.primary.main,
    },
    checkboxMenuItem: {
      color: theme.palette.primary.main,
      fontSize: '14px',
      whiteSpace: 'normal',
      '& .MuiButtonBase-root': {
        padding: '2px',
        color: theme.palette.type === 'light' ? theme.palette.common.white : theme.palette.common.black,
      },
    },
    sectionHeaderMenuItem: {
      listStyle: 'none',
      padding: '12px 16px 2px',
      cursor: 'default',
    },
    sectionHeaderText: {
      color: theme.palette.text.secondary,
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase',
    },
    settingsSelect: {
      listStyle: 'none',
      padding: theme.spacing(1, 2),
      display: 'grid',
      gridTemplateColumns: '1fr minmax(145px, 50%)',
      alignItems: 'center',
      gap: 12,
    },
    settingsSelectLabel: {
      color: theme.palette.primary.main,
      fontSize: 14,
      lineHeight: 1.4,
    },
    settingsSelectInput: {
      width: '100%',
      minWidth: 0,
      minHeight: 32,
      boxSizing: 'border-box',
      padding: '5px 8px',
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 2,
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      font: 'inherit',
      fontSize: 12,
      cursor: 'pointer',
      '&:hover': { borderColor: theme.palette.text.secondary },
      '&:focus-visible': {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: 1,
      },
    },
  }),
)

export const DesktopNavMenu: FunctionComponent = () => {
  const isViewOptionsMenuDisabled = process.env.DISABLE_VIEW_OPTIONS_MENU === 'true'
  const personalSettings = usePersonalSettings()
  const injector = useInjector()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const theme = useTheme()
  const service = injector.getInstance(PersonalSettings)
  const { user } = useAuth()
  const repo = useRepository()
  const localization = useLocalization()
  const { openDialog } = useDialog()
  const history = useHistory()
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

  const openAccountSettings = () => {
    history.push(
      pathWithQueryParams({
        path: resolvePathParams({
          path: PATHS.usersAndGroups.appPath,
          params: { browseType: 'explorer', action: 'edit' },
        }),
        newParams: {
          content: user?.Path,
          needRoot: 'false',
        },
      }),
    )
    handleClose(setOpenUserMenu)
  }

  const switchTheme = () => (event: ChangeEvent<HTMLInputElement>) => {
    const settings = service.userValue.getValue()
    service.setPersonalSettingsValue({ ...settings, theme: event.target.checked ? 'dark' : 'light' })
  }

  const switchDescription = () => (event: ChangeEvent<HTMLInputElement>) => {
    const settings = service.userValue.getValue()
    service.setPersonalSettingsValue({ ...settings, showDescription: event.target.checked })
  }

  const toggleHideSettingsFolder = () => (event: ChangeEvent<HTMLInputElement>) => {
    const settings = service.userValue.getValue()
    service.setPersonalSettingsValue({ ...settings, showHiddenItems: event.target.checked })
  }

  const toggleShowLeafItemsInTree = () => (event: ChangeEvent<HTMLInputElement>) => {
    const settings = service.userValue.getValue()
    service.setPersonalSettingsValue({ ...settings, showLeafItemsInTree: event.target.checked })
  }

  const togglePreferDisplayNameValue = () => (event: ChangeEvent<HTMLInputElement>) => {
    const settings = service.userValue.getValue()
    service.setPersonalSettingsValue({ ...settings, preferDisplayName: event.target.checked })
  }

  const toggleSortFoldersFirstValue = () => (event: ChangeEvent<HTMLInputElement>) => {
    const settings = service.userValue.getValue()
    service.setPersonalSettingsValue({ ...settings, sortFoldersFirst: event.target.checked })
  }

  const updateExplorerSettings = (settings: Partial<PersonalSettingsType>) => {
    service.setPersonalSettingsValue({ ...service.userValue.getValue(), ...settings })
  }

  return (
    <div className={clsx(globalClasses.centered, classes.navMenu, isViewOptionsMenuDisabled && classes.navMenuCompact)}>
      <>
        {!isViewOptionsMenuDisabled ? (
          <IconButton
            aria-label={localization.topMenu.openViewOptions}
            aria-controls={openViewOptions ? 'view-options' : undefined}
            aria-haspopup="true"
            aria-expanded={openViewOptions}
            className={classes.viewOptions}
            onClick={() => handleToggle(setOpenViewOptions)}>
            <TuneOutlined />
          </IconButton>
        ) : null}
        <UserAvatar
          user={user!}
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
                      user={user}
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
                      title: `Full-name: ${user?.DisplayName}` || user?.Name,
                    }}
                    secondaryTypographyProps={{
                      style: {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginLeft: '20px',
                        color: theme.palette.type === 'light' ? globals.light.textColor : globals.dark.textColor,
                      },
                      title: `Login-name: ${user?.LoginName}` || user?.Name,
                    }}
                    primary={`${user?.DisplayName || user?.Name}`}
                    secondary={`${user?.LoginName || user?.Name}`}
                  />
                </MenuItem>
                <MenuItem className={classes.userMenuItem} onClick={openAccountSettings}>
                  <ListItemIcon className={classes.userMenuActionIcon}>
                    <PersonOutline fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={localization.topMenu.accountSettings}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </MenuItem>
                <MenuItem data-test="change-password-menu" onClick={changePassword} className={classes.userMenuItem}>
                  <ListItemIcon className={classes.userMenuActionIcon}>
                    <LockOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={localization.topMenu.changePassword}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </MenuItem>
                <MenuItem onClick={logout} className={classes.userMenuItem}>
                  <ListItemIcon className={classes.userMenuActionIcon}>
                    <ExitToApp fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={localization.topMenu.logout} primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </div>
        </Paper>
      ) : null}
      {!isViewOptionsMenuDisabled && openViewOptions ? (
        <Paper
          className={classes.popperViewWrapper}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              handleClose(setOpenViewOptions)
            }
          }}>
          <div className={classes.popper}>
            <ClickAwayListener onClickAway={() => handleClose(setOpenViewOptions)}>
              <MenuList autoFocusItem={openViewOptions} id="view-options" aria-label={localization.topMenu.viewOptions}>
                <MenuItem onClick={() => handleClose(setOpenViewOptions)}>
                  <Typography component="div" style={{ margin: '0 auto' }}>
                    {localization.topMenu.viewOptions}
                  </Typography>
                </MenuItem>
                <li className={classes.sectionHeaderMenuItem}>
                  <Typography component="div" className={classes.sectionHeaderText}>
                    {localization.topMenu.generalOptions}
                  </Typography>
                </li>
                <MenuItem>
                  <Typography component="div" className={classes.checkboxMenuItem} style={{ width: '100%' }}>
                    <Grid component="label" container alignItems="center" justify="space-between">
                      <Grid item style={{ paddingRight: '16px' }} data-test="theme-status">
                        {localization.topMenu.darkTheme}
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
                      <Grid item style={{ paddingRight: '16px' }} data-test="description-status">
                        {localization.topMenu.showDescription}
                      </Grid>
                      <Grid item>
                        <Switch
                          data-test="description-switcher"
                          checked={personalSettings.showDescription}
                          onChange={switchDescription()}
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
                        {localization.topMenu.sortFoldersFirst}
                      </Grid>
                      <Grid item>
                        <Switch
                          data-test="sort-folders-first-checkbox"
                          checked={personalSettings.sortFoldersFirst}
                          onChange={toggleSortFoldersFirstValue()}
                        />
                      </Grid>
                    </Grid>
                  </Typography>
                </MenuItem>
                <li className={classes.sectionHeaderMenuItem}>
                  <Typography component="div" className={classes.sectionHeaderText}>
                    {localization.contentViews.explorerOptions}
                  </Typography>
                </li>
                <li
                  className={classes.settingsSelect}
                  role="none"
                  onKeyDown={(event) => {
                    if (event.key !== 'Escape') event.stopPropagation()
                  }}>
                  <label htmlFor="default-content-view" className={classes.settingsSelectLabel}>
                    {localization.contentViews.defaultView}
                  </label>
                  <select
                    id="default-content-view"
                    data-test="default-content-view"
                    className={classes.settingsSelectInput}
                    value={personalSettings.defaultContentView}
                    onChange={(event) =>
                      updateExplorerSettings({ defaultContentView: event.target.value as ContentViewMode })
                    }>
                    {ContentViewModes.map((mode) => (
                      <option key={mode} value={mode}>
                        {localization.contentViews[mode]}
                      </option>
                    ))}
                  </select>
                </li>
                <li
                  className={classes.settingsSelect}
                  role="none"
                  onKeyDown={(event) => {
                    if (event.key !== 'Escape') event.stopPropagation()
                  }}>
                  <label htmlFor="default-content-icon-size" className={classes.settingsSelectLabel}>
                    {localization.contentViews.iconSize}
                  </label>
                  <select
                    id="default-content-icon-size"
                    data-test="default-content-icon-size"
                    className={classes.settingsSelectInput}
                    value={personalSettings.contentIconSize}
                    onChange={(event) =>
                      updateExplorerSettings({ contentIconSize: event.target.value as ContentIconSize })
                    }>
                    {ContentIconSizes.map((size) => (
                      <option key={size} value={size}>
                        {localization.contentViews[size]}
                      </option>
                    ))}
                  </select>
                </li>
                <MenuItem>
                  <Typography component="div" className={classes.checkboxMenuItem} style={{ width: '100%' }}>
                    <Grid component="label" container alignItems="center" justify="space-between">
                      <Grid item style={{ paddingRight: '16px' }}>
                        {localization.contentViews.showType}
                      </Grid>
                      <Grid item>
                        <Switch
                          data-test="content-show-type"
                          checked={personalSettings.contentShowType}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateExplorerSettings({ contentShowType: event.target.checked })
                          }
                        />
                      </Grid>
                    </Grid>
                  </Typography>
                </MenuItem>
                <MenuItem>
                  <Typography component="div" className={classes.checkboxMenuItem} style={{ width: '100%' }}>
                    <Grid component="label" container alignItems="center" justify="space-between">
                      <Grid item style={{ paddingRight: '16px' }}>
                        {localization.contentViews.preferDisplayName}
                      </Grid>
                      <Grid item>
                        <Switch
                          data-test="content-prefer-display-name"
                          checked={personalSettings.contentPreferDisplayName}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateExplorerSettings({ contentPreferDisplayName: event.target.checked })
                          }
                        />
                      </Grid>
                    </Grid>
                  </Typography>
                </MenuItem>
                <li className={classes.sectionHeaderMenuItem}>
                  <Typography component="div" className={classes.sectionHeaderText}>
                    {localization.topMenu.treeOptions}
                  </Typography>
                </li>
                <MenuItem>
                  <Typography component="div" className={classes.checkboxMenuItem} style={{ width: '100%' }}>
                    <Grid component="label" container alignItems="center" justify="space-between">
                      <Grid item style={{ paddingRight: '16px' }}>
                        {localization.topMenu.showLeafItemsInTree}
                      </Grid>
                      <Grid item>
                        <Switch
                          data-test="show-leaf-items-in-tree-checkbox"
                          checked={personalSettings.showLeafItemsInTree}
                          onChange={toggleShowLeafItemsInTree()}
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
