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
import React, { useContext, useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { matchPath, NavLink, RouteComponentProps } from 'react-router-dom'
import { PersonalSettingsContext } from '../../context/PersonalSettingsContext'
import { RepositoryContext } from '../../context/RepositoryContext'
import { ResponsivePersonalSetttings } from '../../context/ResponsiveContextProvider'
import { SessionContext } from '../../context/SessionContext'
import { ThemeContext } from '../../context/ThemeContext'
import { LogoutButton } from '../LogoutButton'
import { UserAvatar } from '../UserAvatar'
import { getAllowedDrawerItems } from './Items'

const TemporaryDrawer: React.StatelessComponent<RouteComponentProps & { isOpened: boolean }> = props => {
  const settings = useContext(ResponsivePersonalSetttings)
  const personalSettings = useContext(PersonalSettingsContext)
  const repo = useContext(RepositoryContext)
  const theme = useContext(ThemeContext)
  const session = useContext(SessionContext)
  const [opened, setOpened] = useState(false)
  const [items, setItems] = useState(getAllowedDrawerItems(session.groups))

  useEffect(() => setItems(getAllowedDrawerItems(session.groups)))

  useEffect(() => setOpened(props.isOpened), [props.isOpened])

  if (!settings.drawer.enabled) {
    return null
  }
  return (
    <SwipeableDrawer
      ModalProps={{ keepMounted: true }}
      open={opened}
      onClose={() => setOpened(false)}
      onOpen={() => setOpened(true)}>
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
            .filter(i => settings.drawer.items && settings.drawer.items.indexOf(i.primaryText) !== -1)
            .map(item => {
              const isActive = matchPath(props.location.pathname, item.url)
              return isActive ? (
                <ListItem button={true} disabled={true} key={item.primaryText}>
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
                  onClick={() => setOpened(false)}
                  to={`/${btoa(personalSettings.lastRepository)}${item.url}`}
                  activeStyle={{ opacity: 1 }}
                  style={{ textDecoration: 'none', opacity: 0.54 }}
                  key={item.primaryText}>
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
              <UserAvatar user={session.currentUser} />
            </ListItemIcon>
            <ListItemText
              primary={session.currentUser.DisplayName || session.currentUser.Name}
              secondary={repo.configuration.repositoryUrl}
            />
            <ListItemSecondaryAction>
              <Link to={`/personalSettings`} style={{ textDecoration: 'none' }} onClick={() => setOpened(false)}>
                <IconButton title="Edit personal settings">
                  <Settings />
                </IconButton>
              </Link>
              <LogoutButton onLoggedOut={() => setOpened(false)} />
            </ListItemSecondaryAction>
          </ListItem>
        </Paper>
      </List>
    </SwipeableDrawer>
  )
}

const connectedComponent = withRouter(TemporaryDrawer)
export { connectedComponent as TemporaryDrawer }
