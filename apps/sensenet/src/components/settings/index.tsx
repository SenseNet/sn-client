import { createStyles, ListItem, ListItemText, makeStyles, Theme } from '@material-ui/core'
import clsx from 'clsx'
import React, { lazy } from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'

const ContentComponent = lazy(() => import(/* webpackChunkName: "content" */ '../content'))
const SetupComponent = lazy(() => import(/* webpackChunkName: "setup" */ '../setup/setup'))

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    settingsWrapper: {
      position: 'relative',
    },
    settingsContainer: {
      display: 'flex',
      height: `calc(100% - ${globals.common.drawerItemHeight}px)`,
      borderTop: theme.palette.type === 'light' ? '1px solid #DBDBDB' : '1px solid rgba(255, 255, 255, 0.11)',
    },
    settingsDrawer: {
      width: globals.common.settingsDrawerWidth,
      borderRight: theme.palette.type === 'light' ? '1px solid #DBDBDB' : '1px solid rgba(255, 255, 255, 0.11)',
    },
    settingsContent: {
      width: `calc(100% - ${globals.common.settingsDrawerWidth}px)`,
    },
  }),
)

const items = [
  {
    name: 'configuration',
    displayName: 'Configuration',
    url: '/settings/configuration',
  },
  {
    name: 'stats',
    displayName: 'Stats',
    url: '/settings/stats',
  },
  {
    name: 'apiKeys',
    displayName: 'Api keys',
    url: '/settings/apikeys',
  },
  {
    name: 'localization',
    displayName: 'Localization',
    url: '/settings/localization',
  },
]

export const Settings: React.FunctionComponent = () => {
  const routeMatch = useRouteMatch<{ submenu?: string }>()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const localizationDrawerTitles = useLocalization().drawer.titles

  const renderContent = () => {
    switch (routeMatch.params.submenu) {
      case 'localization':
        return <ContentComponent rootPath={'/Root/Localization'} /> //TODO:snpathra átirni majd
      case 'configuration':
        return <SetupComponent />
      default:
        return <div>Under construction</div>
    }
  }

  return (
    <div className={clsx(globalClasses.contentWrapper, classes.settingsWrapper)} style={{ paddingLeft: 0 }}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)} style={{ display: 'grid' }}>
        <span style={{ fontSize: '20px' }}>{localizationDrawerTitles.Settings}</span>
      </div>
      <div className={classes.settingsContainer}>
        <div className={classes.settingsDrawer}>
          {items.map((item, index) => {
            return (
              <NavLink aria-label={item.url} to={item.url} key={index}>
                <ListItem
                  aria-label={item.name}
                  button={true}
                  key={index}
                  data-test={`drawer-menu-item-${item.name.replace(/\s+/g, '-').toLowerCase()}`}>
                  <ListItemText primary={`${item.displayName}`} />
                </ListItem>
              </NavLink>
            )
          })}
        </div>
        <div className={classes.settingsContent}>{renderContent()}</div>
      </div>
    </div>
  )
}

export default Settings
