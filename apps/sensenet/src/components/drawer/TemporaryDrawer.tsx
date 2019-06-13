import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Tooltip from '@material-ui/core/Tooltip'
import Settings from '@material-ui/icons/Settings'
import { PathHelper } from '@sensenet/client-utils'
import React, { useContext, useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { matchPath, NavLink, RouteComponentProps, Link } from 'react-router-dom'

import { ResponsivePersonalSetttings } from '../../context'
import { useLocalization, usePersonalSettings, useRepository, useSession, useTheme } from '../../hooks'
import { LogoutButton } from '../LogoutButton'
import { UserAvatar } from '../UserAvatar'
import { getAllowedDrawerItems } from './Items'

const TemporaryDrawer: React.FunctionComponent<
  RouteComponentProps & { isOpened: boolean; onClose: () => void; onOpen: () => void }
> = props => {
  const settings = useContext(ResponsivePersonalSetttings)
  const personalSettings = usePersonalSettings()
  const repo = useRepository()
  const theme = useTheme()
  const session = useSession()
  const [items, setItems] = useState(getAllowedDrawerItems(session.groups))
  const [currentRepoEntry, setCurrentRepoEntry] = useState(
    personalSettings.repositories.find(r => r.url === PathHelper.trimSlashes(repo.configuration.repositoryUrl)),
  )

  const localization = useLocalization().drawer

  useEffect(
    () =>
      setCurrentRepoEntry(
        personalSettings.repositories.find(r => r.url === PathHelper.trimSlashes(repo.configuration.repositoryUrl)),
      ),
    [personalSettings, repo],
  )

  useEffect(() => setItems(getAllowedDrawerItems(session.groups)), [session.groups])

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
          // width: 270,
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
          {items
            .filter(i => settings.drawer.items && settings.drawer.items.indexOf(i.name) !== -1)
            .map(item => {
              const isActive = matchPath(props.location.pathname, item.url)
              return isActive ? (
                <ListItem button={true} disabled={true} key={item.name}>
                  <Tooltip
                    title={
                      <React.Fragment>
                        {localization[item.primaryText]} <br /> {localization[item.secondaryText]}
                      </React.Fragment>
                    }
                    placement="right">
                    <ListItemIcon>{item.icon}</ListItemIcon>
                  </Tooltip>
                  <ListItemText primary={localization[item.primaryText]} secondary={localization[item.secondaryText]} />
                </ListItem>
              ) : (
                <NavLink
                  onClick={() => props.onClose()}
                  to={`/${btoa(repo.configuration.repositoryUrl)}${item.url}`}
                  activeStyle={{ opacity: 1 }}
                  style={{ textDecoration: 'none', opacity: 0.54 }}
                  key={item.name}>
                  <ListItem button={true}>
                    <Tooltip
                      title={
                        <React.Fragment>
                          {localization[item.primaryText]} <br /> {localization[item.secondaryText]}
                        </React.Fragment>
                      }
                      placement="right">
                      <ListItemIcon>{item.icon}</ListItemIcon>
                    </Tooltip>
                    <ListItemText
                      primary={localization[item.primaryText]}
                      secondary={localization[item.secondaryText]}
                    />
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
              secondary={(currentRepoEntry && currentRepoEntry.displayName) || repo.configuration.repositoryUrl}
              secondaryTypographyProps={{ style: { overflow: 'hidden', textOverflow: 'ellipsis' } }}
            />
            <ListItemSecondaryAction>
              <Link to={`/personalSettings`} style={{ textDecoration: 'none' }} onClick={() => props.onClose()}>
                <IconButton title={localization.personalSettingsTitle}>
                  <Settings />
                </IconButton>
              </Link>
              <LogoutButton onLoggedOut={() => props.onClose()} />
            </ListItemSecondaryAction>
          </ListItem>
        </Paper>
      </List>
    </SwipeableDrawer>
  )
}

const connectedComponent = withRouter(TemporaryDrawer)
export { connectedComponent as TemporaryDrawer }
