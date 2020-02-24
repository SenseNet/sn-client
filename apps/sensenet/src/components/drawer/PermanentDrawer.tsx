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
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import clsx from 'clsx'
import { useDrawerItems, useLocalization, usePersonalSettings, useSelectionService } from '../../hooks'
import { ResponsivePersonalSetttings } from '../../context'
import { AddButton } from '../AddButton'
import { SearchButton } from '../search-button'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    paperStyle: {
      flexGrow: 0,
      flexShrink: 0,
      width: '90px',
      position: 'relative',
    },
    listStyle: {
      width: '100%',
      height: '100%',
      flexGrow: 1,
      flexShrink: 0,
      display: 'flex',
      overflow: 'hidden',
      justifyContent: 'space-between',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.default, // '#222',
      transition: 'width 100ms ease-in-out',
      paddingTop: 0,
      '&$opened': {
        width: 330,
      },
    },
    opened: {},
    listWrapper: {
      overflowY: 'auto',
      overflowX: 'hidden',
      width: '100%',
    },
    navLinkStyle: {
      textDecoration: 'none',
      opacity: 0.54,
    },
    listButton: {
      height: '65px',
    },
    navLinkActiveStyle: {
      opacity: 1,
      '& .MuiListItem-root': { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText },
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
    expandCollapseWrapper: {
      height: '49px',
      padding: '0 0 12px 0',
      borderBottom: 'transparent 1px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '13px',
    },
    centered: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
})

const PermanentDrawer: React.FunctionComponent<RouteComponentProps> = props => {
  const personalSettings = usePersonalSettings()
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
          {settings.drawer.type === 'mini-variant' ? (
            <ListItem
              className={clsx(classes.centered, classes.listButton)}
              button={true}
              onClick={() => setOpened(!opened)}
              key="expandcollapse">
              <ListItemIcon className={classes.centered}>
                <Tooltip
                  className={classes.centered}
                  title={opened ? localization.collapse : localization.expand}
                  placement="right">
                  <div>{opened ? <Close /> : <Menu />}</div>
                </Tooltip>
              </ListItemIcon>
            </ListItem>
          ) : null}

          {matchPath(props.location.pathname, `/:repositoryId/saved-queries`) === null ? (
            <AddButton isOpened={opened} parent={currentComponent} path={currentPath} />
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
                  className={classes.listButton}
                  button={true}
                  key={index}
                  selected={matchPath(props.location.pathname, `/:repositoryId${item.url}`) === null ? false : true}>
                  <ListItemIcon
                    className={clsx(classes.listItemIconDark, classes.centered, {
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
