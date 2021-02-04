import { createStyles, ListItem, ListItemText, makeStyles, Theme } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import clsx from 'clsx'
import React, { lazy } from 'react'
import { matchPath, NavLink, useLocation, useRouteMatch } from 'react-router-dom'
import { PATHS, resolvePathParams } from '../../application-paths'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'

const ContentComponent = lazy(() => import(/* webpackChunkName: "content" */ '../content'))
const SetupComponent = lazy(() => import(/* webpackChunkName: "setup" */ './setup'))
const PersonalSettingsEditor = lazy(
  () => import(/* webpackChunkName: "PersonalSettingsEditor" */ './PersonalSettingsEditor'),
)

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
    underConstructionWrapper: {
      flexFlow: 'column',
      height: '100%',
    },
    underConstructionIcon: {
      fontSize: '74px',
      margin: '10px',
    },
  }),
)

export const settingsItems = [
  {
    name: 'configuration',
    displayName: 'Configuration',
    url: resolvePathParams({ path: PATHS.configuration.appPath }),
  },
  {
    name: 'stats',
    displayName: 'Stats',
    url: '/settings/stats',
  },
  {
    name: 'apiKeys',
    displayName: 'Api and security',
    url: '/settings/apikeys',
  },
  {
    name: 'localization',
    displayName: 'Localization',
    url: resolvePathParams({ path: PATHS.localization.appPath }),
  },
  {
    name: 'webhooks',
    displayName: 'Webhooks',
    url: resolvePathParams({ path: PATHS.webhooks.appPath }),
  },
  {
    name: 'adminui',
    displayName: 'Admin-ui customization',
    url: '/settings/adminui',
  },
]

export const Settings: React.FunctionComponent = () => {
  const routeMatch = useRouteMatch<{ submenu?: string }>()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const localizationDrawerTitles = useLocalization().drawer.titles
  const location = useLocation()

  const renderContent = () => {
    switch (routeMatch.params.submenu) {
      case 'localization':
        return <ContentComponent rootPath={PATHS.localization.snPath} />
      case 'configuration':
        return <SetupComponent />
      case 'adminui':
        return <PersonalSettingsEditor />
      case 'webhooks':
        return (
          <ContentComponent
            rootPath={PATHS.webhooks.snPath}
            fieldsToDisplay={['DisplayName', 'WebHookUrl' as any, 'Enabled' as any, 'SuccessfulCalls' as any]}
            schema={'WebHookSubscription'}
          />
        )
      default:
        return (
          <div className={clsx(globalClasses.centered, classes.underConstructionWrapper)}>
            <SettingsIcon className={classes.underConstructionIcon} />
            <div>Under construction</div>
          </div>
        )
    }
  }

  return (
    <div className={clsx(globalClasses.contentWrapper, classes.settingsWrapper)} style={{ paddingLeft: 0 }}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)} style={{ display: 'grid' }}>
        <span style={{ fontSize: '20px' }}>{localizationDrawerTitles.Settings}</span>
      </div>
      <div className={classes.settingsContainer}>
        <div className={classes.settingsDrawer}>
          {settingsItems.map((item, index) => {
            return (
              <NavLink aria-label={item.url} to={item.url} key={index}>
                <ListItem
                  aria-label={item.name}
                  button={true}
                  key={index}
                  selected={!!matchPath(location.pathname, item.url)}
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
