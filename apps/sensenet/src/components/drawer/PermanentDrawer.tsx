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
import { useDrawerItems, useLocalization, usePersonalSettings } from '../../hooks'
import { ResponsivePersonalSetttings } from '../../context'
import { AddButton } from '../AddButton'
import { SearchButton } from '../search-button'

const useStyles = makeStyles((theme: Theme) => {
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
      '& .MuiListItem-root': { backgroundColor: theme.palette.primary.main },
      '& svg': {
        fill: theme.palette.common.white,
      },
    },
    listItemIconDark: {
      color: theme.palette.common.white,
    },
    listItemIconLight: {
      color: theme.palette.common.black,
      opacity: 0.87,
    },
    listItemIconActiveStyle: {
      color: theme.palette.common.white,
    },
  })
})

const PermanentDrawer: React.FunctionComponent<RouteComponentProps> = props => {
  const personalSettings = usePersonalSettings()
  const classes = useStyles()
  const settings = useContext(ResponsivePersonalSetttings)
  const repo = useRepository()
  const [currentPath, setCurrentPath] = useState('')
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
                <ListItemIcon>
                  <Tooltip title={opened ? localization.collapse : localization.expand} placement="right">
                    <div>{opened ? <Close /> : <Menu />}</div>
                  </Tooltip>
                </ListItemIcon>
              </ListItem>
            ) : null}
          </div>

          {matchPath(props.location.pathname, `/:repositoryId/saved-queries`) === null ? (
            matchPath(props.location.pathname, { path: `/`, exact: true }) === null &&
            matchPath(props.location.pathname, { path: `/personalSettings`, exact: true }) === null && (
              <AddButton isOpened={opened} path={currentPath} />
            )
          ) : (
            <SearchButton isOpened={opened} />
          )}

          {items.map((item, index) => {
            return (
              <NavLink
                to={`/${btoa(repo.configuration.repositoryUrl)}${item.url}`}
                className={classes.navLinkStyle}
                key={index}
                onClick={() => setCurrentPath(item.root ? item.root : '')}
                activeClassName={classes.navLinkActiveStyle}>
                <ListItem
                  button={true}
                  key={index}
                  selected={matchPath(props.location.pathname, `/:repositoryId${item.url}`) === null ? false : true}>
                  <ListItemIcon
                    className={clsx(classes.listItemIconDark, {
                      [classes.listItemIconLight]: personalSettings.theme === 'light',
                    })}>
                    <Tooltip title={item.secondaryText} placement="right">
                      {item.icon}
                    </Tooltip>
                  </ListItemIcon>
                  {opened ? <ListItemText primary={item.primaryText} /> : null}
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
