import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import Settings from '@material-ui/icons/Settings'
import React, { useContext } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link, matchPath, NavLink, RouteComponentProps } from 'react-router-dom'
import { ResponsivePersonalSetttings } from '../../context/ResponsiveContextProvider'
import { ThemeContext } from '../../context/ThemeContext'
import { rootStateType } from '../../store'
import { toggleDrawer } from '../../store/Drawer'
import { UserAvatar } from '../UserAvatar'

const mapStateToProps = (state: rootStateType) => ({
  items: state.drawer.items,
  opened: state.drawer.opened,
  user: state.session.currentUser,
  repositoryUrl: state.persistedState.lastRepositoryUrl,
})

const mapDispatchToProps = {
  toggleDrawer,
}

const PermanentDrawer: React.StatelessComponent<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps
> = props => {
  const settings = useContext(ResponsivePersonalSetttings)
  const theme = useContext(ThemeContext)

  if (!settings.drawer.enabled) {
    return null
  }

  const opened = props.opened || settings.drawer.type === 'permanent'

  return (
    <Paper style={{ flexGrow: 0, flexShrink: 0 }}>
      <List
        dense={true}
        style={{
          width: opened ? 270 : 55,
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
                  {props.opened ? <ListItemText primary={item.primaryText} secondary={item.secondaryText} /> : null}
                </ListItem>
              ) : (
                <NavLink
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
                    {opened ? <ListItemText primary={item.primaryText} secondary={item.secondaryText} /> : null}
                  </ListItem>
                </NavLink>
              )
            })}
        </div>
        <div>
          {opened ? (
            <Paper style={{ padding: '1em' }}>
              <ListItem>
                <ListItemIcon>
                  <UserAvatar user={props.user} repositoryUrl={props.repositoryUrl} />
                </ListItemIcon>
                <ListItemText primary={props.user.DisplayName || props.user.Name} />
                <ListItemSecondaryAction>
                  <Link to={`/personalSettings`} style={{ textDecoration: 'none' }}>
                    <IconButton title="Edit personal settings">
                      <Settings />
                    </IconButton>
                  </Link>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          ) : (
            <NavLink
              to={'/personalSettings'}
              activeStyle={{ opacity: 1 }}
              style={{ textDecoration: 'none', opacity: 0.54 }}
              key={'personalSettings'}>
              <ListItem button={true}>
                <Tooltip
                  title={
                    <React.Fragment>
                      {'Personal settings'} <br /> {'Customize the application behavior'}
                    </React.Fragment>
                  }
                  placement="right">
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                </Tooltip>
              </ListItem>
            </NavLink>
          )}

          {settings.drawer.type === 'mini-variant' ? (
            <ListItem button={true} onClick={props.toggleDrawer} key="expandcollapse">
              <Tooltip title={opened ? 'Collapse' : 'Expand'} placement="right">
                <ListItemIcon>{opened ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}</ListItemIcon>
              </Tooltip>
              {opened ? <ListItemText primary="Collapse sidebar" /> : null}
            </ListItem>
          ) : null}
        </div>
      </List>
    </Paper>
  )
}

const connectedComponent = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(PermanentDrawer),
)
export { connectedComponent as PermanentDrawer }
