import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import { Close, Menu } from '@material-ui/icons'
import React, { useContext, useState } from 'react'
import { withRouter } from 'react-router'
import { matchPath, NavLink, RouteComponentProps } from 'react-router-dom'
import { useRepository } from '@sensenet/hooks-react'
import { ResponsivePersonalSetttings } from '../../context'
import { useDrawerItems, useLocalization, useTheme } from '../../hooks'

const PermanentDrawer: React.FunctionComponent<RouteComponentProps> = props => {
  const settings = useContext(ResponsivePersonalSetttings)
  const theme = useTheme()
  const repo = useRepository()

  const [opened, setOpened] = useState(settings.drawer.type === 'permanent')
  const items = useDrawerItems()
  const localization = useLocalization().drawer

  if (!settings.drawer.enabled) {
    return null
  }

  return (
    <Paper style={{ flexGrow: 0, flexShrink: 0 }}>
      <List
        style={{
          width: opened ? 330 : 55,
          height: '100%',
          flexGrow: 1,
          flexShrink: 0,
          display: 'flex',
          overflow: 'hidden',
          justifyContent: 'space-between',
          flexDirection: 'column',
          backgroundColor: theme.palette.background.default, // '#222',
          transition: 'width 100ms ease-in-out',
        }}>
        <div style={{ paddingTop: '1em', overflowY: 'auto', overflowX: 'hidden' }}>
          <div>
            {settings.drawer.type === 'mini-variant' ? (
              <ListItem button={true} onClick={() => setOpened(!opened)} key="expandcollapse">
                <Tooltip title={opened ? localization.collapse : localization.expand} placement="right">
                  <ListItemIcon>{opened ? <Close /> : <Menu />}</ListItemIcon>
                </Tooltip>
              </ListItem>
            ) : null}
          </div>
          {items.map((item, index) => {
            const isActive = matchPath(props.location.pathname, `/:repositoryId${item.url}`)
            return isActive ? (
              <ListItem button={true} key={index} selected>
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
            ) : (
              <NavLink
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
                  {opened ? <ListItemText primary={item.primaryText} secondary={item.secondaryText} /> : null}
                </ListItem>
              </NavLink>
            )
          })}
        </div>
      </List>
    </Paper>
  )
}

const connectedComponent = withRouter(PermanentDrawer)
export { connectedComponent as PermanentDrawer }
