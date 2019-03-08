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
import React, { useContext } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { matchPath, NavLink, RouteComponentProps } from 'react-router-dom'
import { ResponsivePersonalSetttings } from '../../context/ResponsiveContextProvider'
import { SessionContext } from '../../context/SessionContext'
import { ThemeContext } from '../../context/ThemeContext'
import { rootStateType } from '../../store'
import { closeDrawer, openDrawer } from '../../store/Drawer'
import { UserAvatar } from '../UserAvatar'

const mapStateToProps = (state: rootStateType) => ({
  items: state.drawer.items,
  opened: state.drawer.opened,
  repositoryUrl: state.persistedState.lastRepositoryUrl,
})

const mapDispatchToProps = {
  openDrawer,
  closeDrawer,
}

const TemporaryDrawer: React.StatelessComponent<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps
> = props => {
  const settings = useContext(ResponsivePersonalSetttings)
  const theme = useContext(ThemeContext)
  const session = useContext(SessionContext)

  if (!settings.drawer.enabled) {
    return null
  }
  return (
    <SwipeableDrawer open={props.opened} onClose={() => props.closeDrawer()} onOpen={() => props.openDrawer()}>
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
          {props.items
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
                  onClick={() => props.closeDrawer()}
                  to={item.url}
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
              <UserAvatar user={session.currentUser} repositoryUrl={props.repositoryUrl} />
            </ListItemIcon>
            <ListItemText primary={session.currentUser.DisplayName || session.currentUser.Name} />
            <ListItemSecondaryAction>
              <Link to={`/personalSettings`} style={{ textDecoration: 'none' }} onClick={() => props.closeDrawer()}>
                <IconButton title="Edit personal settings">
                  <Settings />
                </IconButton>
              </Link>
            </ListItemSecondaryAction>
          </ListItem>
        </Paper>
      </List>
    </SwipeableDrawer>
  )
}

const connectedComponent = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(TemporaryDrawer),
)
export { connectedComponent as TemporaryDrawer }
