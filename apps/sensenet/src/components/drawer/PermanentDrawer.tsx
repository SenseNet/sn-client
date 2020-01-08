import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import { Close, Menu } from '@material-ui/icons'
import React, { useContext, useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { matchPath, NavLink, RouteComponentProps } from 'react-router-dom'
import { useRepository } from '@sensenet/hooks-react'
import clsx from 'clsx'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { ResponsivePersonalSetttings } from '../../context'
import { useDrawerItems, useLocalization, useSelectionService } from '../../hooks'
import { AddButton } from '../AddButton'

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
  const selectionService = useSelectionService()
  const repo = useRepository()
  const [currentComponent, setCurrentComponent] = useState(selectionService.activeContent.getValue())
  const [currentPath, setCurrentPath] = useState('')
  const [opened, setOpened] = useState(settings.drawer.type === 'permanent')
  const items = useDrawerItems()
  const localization = useLocalization().drawer

  useEffect(() => {
    const activeComponentObserve = selectionService.activeContent.subscribe(newActiveComponent =>
      setCurrentComponent(newActiveComponent),
    )

    return function cleanup() {
      activeComponentObserve.dispose()
    }
  }, [selectionService.activeContent])

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

          <AddButton isOpened={opened} parent={currentComponent} path={currentPath} />
          {items.map((item, index) => {
            return (
              <NavLink
                to={`/${btoa(repo.configuration.repositoryUrl)}${item.url}`}
                className={classes.navLinkStyle}
                key={index}
                onClick={() => setCurrentPath(item.root ? item.root : '')}>
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
