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
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import clsx from 'clsx'
import { ResponsivePersonalSetttings } from '../../context'
import { useDrawerItems, useLocalization } from '../../hooks'

const useStyles = makeStyles((theme: Theme) => {
  const primary = theme.palette.primary.main

  return createStyles({
    paperStyle: {
      flexGrow: 0,
      flexShrink: 0,
    },
    listStyle: {
      width: 55,
      height: '100%',
      flexGrow: 1,
      flexShrink: 0,
      display: 'flex',
      overflow: 'hidden',
      justifyContent: 'space-between',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.default, // '#222',
      transition: 'width 100ms ease-in-out',
      '&$opened': {
        width: 330,
      },
    },
    opened: {},
    listWrapper: {
      paddingTop: '1em',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    navLinkStyle: {
      textDecoration: 'none',
      opacity: 0.54,
    },
    navLinkActiveStyle: {
      opacity: 1,
      backgroundColor: primary,
    },
    listItemIconDark: {
      color: theme.palette.common.white,
    },
    listItemIconLight: {
      color: theme.palette.common.black,
    },
  })
})

const PermanentDrawer: React.FunctionComponent<RouteComponentProps> = props => {
  const classes = useStyles()
  const settings = useContext(ResponsivePersonalSetttings)
  const repo = useRepository()

  const [opened, setOpened] = useState(settings.drawer.type === 'permanent')
  const items = useDrawerItems()
  const localization = useLocalization().drawer

  if (!settings.drawer.enabled) {
    return null
  }

  return (
    <Paper className={classes.paperStyle}>
      <List className={clsx(classes.listStyle, { [classes.opened]: opened })}>
        <div className={classes.listWrapper}>
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
            return (
              <NavLink
                to={`/${btoa(repo.configuration.repositoryUrl)}${item.url}`}
                activeClassName={classes.navLinkActiveStyle}
                className={classes.navLinkStyle}
                key={index}
                isActive={match => {
                  if (!match) {
                    return false
                  }
                  return true
                }}>
                <Tooltip title={item.secondaryText} placement="right">
                  <ListItem
                    style={{ backgroundColor: 'inherit' }}
                    button={true}
                    key={index}
                    selected={matchPath(props.location.pathname, `/:repositoryId${item.url}`) === null ? false : true}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    {opened ? <ListItemText primary={item.primaryText} /> : null}
                  </ListItem>
                </Tooltip>
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
