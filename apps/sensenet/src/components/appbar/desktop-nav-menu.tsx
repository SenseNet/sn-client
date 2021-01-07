import { Switch } from '@sensenet/controls-react'
import { useInjector, useLogger, useRepository } from '@sensenet/hooks-react'
import {
  Grid,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from '@material-ui/core'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import BugReport from '@material-ui/icons/BugReport'
import Feedback from '@material-ui/icons/Feedback'
import HelpOutline from '@material-ui/icons/HelpOutline'
import Info from '@material-ui/icons/Info'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useCurrentUser } from '../../context/current-user-provider'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization, usePersonalSettings } from '../../hooks'
import { PersonalSettings } from '../../services'
import { useDialog } from '../dialogs'
import { UserAvatar } from '../UserAvatar'

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
    popperHelpWrapper: {
      position: 'absolute',
      top: globals.common.headerHeight,
      right: '88px',
      height: 'fit-content',
      width: 'fit-content',
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
    helpMenuItem: {
      color: theme.palette.primary.main,
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
  const currentUser = useCurrentUser()
  const repo = useRepository()
  const localization = useLocalization()
  const { openDialog } = useDialog()
  const logger = useLogger('desktop-nav-menu')
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const [openHelpMenu, setOpenHelpMenu] = useState(false)

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter((prevState) => !prevState)
  }

  const handleClose = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(false)
  }

  const logout = () => {
    openDialog({ name: 'logout' })
    handleClose(setOpenUserMenu)
  }

  const changePw = async () => {
    try {
      await repo.executeAction({
        idOrPath: currentUser.Path,
        name: 'SendChangePasswordMail',
        method: 'POST',
        body: {
          returnUrl: 'https://admin.sensenet.com',
        },
      })
    } catch (error) {
      logger.warning({ message: error.message })
    } finally {
      handleClose(setOpenUserMenu)
    }
  }

  const feedback = () => {
    openDialog({ name: 'feedback' })
    handleClose(setOpenHelpMenu)
  }

  const switchTheme = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    const settings = service.userValue.getValue()
    service.setPersonalSettingsValue({ ...settings, theme: event.target.checked ? 'dark' : 'light' })
  }

  return (
    <div className={clsx(globalClasses.centered, classes.navMenu)}>
      <IconButton
        aria-label={localization.topMenu.openHelpMenu}
        aria-controls={openUserMenu ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={() => handleToggle(setOpenHelpMenu)}
        className={classes.iconButton}
        style={{ marginRight: '16px' }}>
        <HelpOutline className={classes.icon} />
      </IconButton>
      <>
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
                        marginLeft: '30px',
                        color: theme.palette.type === 'light' ? globals.light.textColor : globals.dark.textColor,
                      },
                      title: currentUser.DisplayName || currentUser.Name,
                    }}
                    primary={`${currentUser.DisplayName || currentUser.Name}`}
                  />
                </MenuItem>
                <MenuItem onClick={changePw} className={classes.userMenuItem}>
                  {localization.topMenu.changePassword}
                </MenuItem>
                <MenuItem onClick={logout} className={classes.userMenuItem}>
                  {localization.topMenu.logout}
                </MenuItem>
                <MenuItem>
                  <Typography component="div" className={classes.themeSwitcher}>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item style={{ paddingRight: '32px' }}>
                        {personalSettings.theme === 'dark' ? 'Light theme' : 'Dark theme'}
                      </Grid>
                      <Grid item>
                        <Switch checked={personalSettings.theme === 'dark'} onChange={switchTheme()} />
                      </Grid>
                    </Grid>
                  </Typography>
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </div>
        </Paper>
      ) : null}
      {openHelpMenu ? (
        <Paper className={classes.popperHelpWrapper}>
          <div className={classes.popper}>
            <ClickAwayListener onClickAway={() => handleClose(setOpenHelpMenu)}>
              <MenuList autoFocusItem={openHelpMenu} id="menu-list-grow">
                <Link href="https://docs.sensenet.com/" target="_blank">
                  <MenuItem onClick={() => handleClose(setOpenHelpMenu)} className={classes.helpMenuItem}>
                    <ListItemIcon>
                      <Info />
                    </ListItemIcon>
                    <ListItemText primary={localization.topMenu.documentation} />
                  </MenuItem>
                </Link>
                <Link
                  href="https://github.com/SenseNet/sn-client/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D"
                  target="_blank">
                  <MenuItem onClick={() => handleClose(setOpenHelpMenu)} className={classes.helpMenuItem}>
                    <ListItemIcon>
                      <BugReport />
                    </ListItemIcon>
                    <ListItemText primary={localization.topMenu.reportBug} />
                  </MenuItem>
                </Link>
                <MenuItem onClick={feedback} className={classes.helpMenuItem}>
                  <ListItemIcon>
                    <Feedback />
                  </ListItemIcon>
                  <ListItemText primary={localization.topMenu.feedback} />
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </div>
        </Paper>
      ) : null}
    </div>
  )
}
