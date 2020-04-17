import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  SwipeableDrawer,
  Tooltip,
} from '@material-ui/core'
import Settings from '@material-ui/icons/Settings'
import { useRepository, useSession } from '@sensenet/hooks-react'
import React, { useContext } from 'react'
import { Link, matchPath, NavLink, useLocation } from 'react-router-dom'
import { ResponsiveContext, ResponsivePersonalSettings } from '../../context'
import { useDrawerItems, useLocalization, useTheme } from '../../hooks'
import { LogoutButton } from '../LogoutButton'
import { UserAvatar } from '../UserAvatar'

type TemporaryDrawerProps = {
  isOpened: boolean
  onClose: () => void
  onOpen: () => void
}

export const TemporaryDrawer = (props: TemporaryDrawerProps) => {
  const settings = useContext(ResponsivePersonalSettings)
  const device = useContext(ResponsiveContext)
  const repo = useRepository()
  const location = useLocation()
  const theme = useTheme()
  const session = useSession()
  const items = useDrawerItems()
  const localization = useLocalization().drawer

  if (!settings.drawer.enabled) {
    return null
  }
  return (
    <SwipeableDrawer
      ModalProps={{ keepMounted: true }}
      PaperProps={{ style: { width: '90%' } }}
      open={props.isOpened}
      onClose={() => props.onClose()}
      onOpen={() => props.onOpen()}>
      <List
        dense={true}
        style={{
          height: '100%',
          flexGrow: 1,
          flexShrink: 0,
          display: 'flex',
          overflow: 'hidden',
          justifyContent: 'space-between',
          flexDirection: 'column',
          backgroundColor: theme.palette.background.default, // '#222',
          paddingTop: '1em',
          transition: 'width 100ms ease-in-out',
        }}>
        <div style={{ paddingTop: '1em' }}>
          {items.map((item, index) => {
            const isActive = matchPath(location.pathname, { path: `/:repositoryId${item.url}`, exact: true })
            return isActive ? (
              <ListItem button={true} selected key={index}>
                <Tooltip
                  title={
                    <React.Fragment>
                      {item.primaryText} <br /> {item.secondaryText}
                    </React.Fragment>
                  }
                  placement="right">
                  <ListItemIcon>{item.icon}</ListItemIcon>
                </Tooltip>
                <ListItemText primary={item.primaryText} secondary={item.secondaryText} />
              </ListItem>
            ) : (
              <NavLink
                onClick={() => props.onClose()}
                to={`/${btoa(repo.configuration.repositoryUrl)}${item.url}`}
                activeStyle={{ opacity: 1 }}
                style={{ textDecoration: 'none', opacity: 0.54 }}
                key={index}>
                <ListItem button={true}>
                  <Tooltip
                    title={
                      <React.Fragment>
                        {item.primaryText} <br /> {item.secondaryText}
                      </React.Fragment>
                    }
                    placement="right">
                    <ListItemIcon>{item.icon}</ListItemIcon>
                  </Tooltip>
                  <ListItemText primary={item.primaryText} secondary={item.secondaryText} />
                </ListItem>
              </NavLink>
            )
          })}
        </div>
        <Paper style={{ padding: '1em' }}>
          <ListItem>
            <ListItemIcon>
              <UserAvatar repositoryUrl={repo.configuration.repositoryUrl} user={session.currentUser} />
            </ListItemIcon>
            <ListItemText
              primary={session.currentUser.DisplayName || session.currentUser.Name}
              secondary={repo.configuration.repositoryUrl}
              secondaryTypographyProps={{ style: { overflow: 'hidden', textOverflow: 'ellipsis' } }}
            />
            <ListItemSecondaryAction>
              {device === 'mobile' ? null : (
                <Link to={`/personalSettings`} style={{ textDecoration: 'none' }} onClick={() => props.onClose()}>
                  <IconButton title={localization.personalSettingsTitle}>
                    <Settings />
                  </IconButton>
                </Link>
              )}
              <LogoutButton />
            </ListItemSecondaryAction>
          </ListItem>
        </Paper>
      </List>
    </SwipeableDrawer>
  )
}
