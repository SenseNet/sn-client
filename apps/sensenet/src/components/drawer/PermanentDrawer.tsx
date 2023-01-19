import { createStyles, makeStyles, Theme } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import { Close, Menu } from '@material-ui/icons'
import clsx from 'clsx'
import React, { useContext, useState } from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import { PATHS } from '../../application-paths'
import { ResponsivePersonalSettings } from '../../context'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useDrawerItems, useLocalization } from '../../hooks'
import { AddButton } from '../AddButton'
import { SearchButton } from '../search-button'
import { PermanentDrawerItem } from './PermanentDrawerItem'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    paper: {
      flexGrow: 0,
      flexShrink: 0,
      position: 'relative',
      width: globals.common.drawerWidthCollapsed,
      '&$opened': {
        width: globals.common.drawerWidthExpanded,
      },
    },
    opened: {},
    backgroundDiv: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: theme.palette.type === 'light' ? globals.light.drawerBackground : globals.dark.drawerBackground,
      border: theme.palette.type === 'light' ? clsx(globals.light.borderColor, '1px') : 'none',
    },
    list: {
      width: '100%',
      flexGrow: 1,
      flexShrink: 0,
      display: 'flex',
      overflow: 'hidden',
      justifyContent: 'space-between',
      flexDirection: 'column',
      transition: 'width 100ms ease-in-out',
      paddingTop: 0,
    },
    listWrapper: {
      overflowY: 'auto',
      overflowX: 'hidden',
      width: '100%',
    },
    listButton: {
      height: '65px',
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
  })
})

export const PermanentDrawer = () => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const settings = useContext(ResponsivePersonalSettings)
  const [opened, setOpened] = useState(settings.drawer.type === 'permanent')
  const items = useDrawerItems()
  const localization = useLocalization().drawer
  const location = useLocation()

  const baseItems = items.filter((item) => !item.systemItem)

  const settingsItems = items.filter((item) => item.systemItem)

  if (!settings.drawer.enabled) {
    return null
  }

  return (
    <Paper className={clsx(classes.paper, { [classes.opened]: opened })} data-test="drawer">
      <div className={classes.backgroundDiv}>
        <List className={classes.list}>
          <li className={classes.listWrapper}>
            {settings.drawer.type === 'mini-variant' ? (
              <ListItem
                aria-label="expandcollapse"
                className={classes.listButton}
                button={true}
                onClick={() => setOpened(!opened)}
                key="expandcollapse"
                data-test="drawer-expandcollapse-button">
                <ListItemIcon className={globalClasses.centered}>
                  <Tooltip
                    className={globalClasses.centered}
                    title={opened ? localization.collapse : localization.expand}
                    placement="right">
                    <>{opened ? <Close /> : <Menu />}</>
                  </Tooltip>
                </ListItemIcon>
              </ListItem>
            ) : null}
            {matchPath(location.pathname, PATHS.savedQueries.appPath) ? <SearchButton isOpened={opened} /> : null}{' '}
            {matchPath(location.pathname, [
              PATHS.content.appPath,
              PATHS.usersAndGroups.appPath,
              PATHS.contentTypes.appPath,
              PATHS.settings.appPath,
              PATHS.custom.appPath.replace(':path', 'root'),
            ]) ? (
              <AddButton aria-label={localization.add} isOpened={opened} />
            ) : null}
            {baseItems.map((item) => {
              return (
                item.itemType !== 'Settings' && <PermanentDrawerItem item={item} opened={opened} key={item.itemType} />
              )
            })}
          </li>
        </List>

        {settingsItems && (
          <List>
            {settingsItems.map((item) => {
              return (
                <li key={item.itemType}>
                  <PermanentDrawerItem item={item} opened={opened} />
                </li>
              )
            })}
          </List>
        )}
      </div>
    </Paper>
  )
}
