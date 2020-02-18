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
import { useSession } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { Link, matchPath, NavLink, RouteComponentProps } from 'react-router-dom'
import { ResponsiveContext, ResponsivePersonalSetttings } from '../../context'
import { useDrawerItems, useLocalization, usePersonalSettings, useTheme } from '../../hooks'
import { useRepoState } from '../../services'
import { LogoutButton } from '../LogoutButton'
import { UserAvatar } from '../UserAvatar'

const TemporaryDrawer: React.FunctionComponent<RouteComponentProps & {
  isOpened: boolean
  onClose: () => void
  onOpen: () => void
}> = props => {
  const settings = useContext(ResponsivePersonalSetttings)
  const device = useContext(ResponsiveContext)
  const personalSettings = usePersonalSettings()
  const repo = useRepoState().getCurrentRepoState()!.repository
  const theme = useTheme()
  const session = useSession()
  const items = useDrawerItems()

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
          {items.map((item, index) => {
            const isActive = matchPath(props.location.pathname, { path: `/:repositoryId${item.url}`, exact: true })
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
              secondary={(currentRepoEntry && currentRepoEntry.displayName) || repo.configuration.repositoryUrl}
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
