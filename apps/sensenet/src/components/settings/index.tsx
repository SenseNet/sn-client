import { createStyles, ListItem, ListItemText, makeStyles, Theme } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import { clsx } from 'clsx'
import React, { lazy } from 'react'
import { matchPath, NavLink, useLocation, useRouteMatch } from 'react-router-dom'
import { PATHS, resolvePathParams } from '../../application-paths'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { ApiKeys } from './api-keys'
import { Stats } from './stats'

const ContentComponent = lazy(() => import(/* webpackChunkName: "content" */ '../content'))
const SetupComponent = lazy(() => import(/* webpackChunkName: "setup" */ './setup'))
const PersonalSettingsEditor = lazy(
  () => import(/* webpackChunkName: "PersonalSettingsEditor" */ './personal-settings-editor'),
)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    settingsWrapper: {
      position: 'relative',
    },
    settingsContainer: {
      display: 'flex',
      minHeight: `calc(100% - ${globals.common.drawerItemHeight}px)`,
      borderTop: theme.palette.type === 'light' ? '1px solid #DBDBDB' : '1px solid rgba(255, 255, 255, 0.11)',
    },
    settingsDrawer: {
      width: globals.common.settingsDrawerWidth,
      borderRight: theme.palette.type === 'light' ? '1px solid #DBDBDB' : '1px solid rgba(255, 255, 255, 0.11)',
    },
    settingsContent: {
      overflow: 'auto',
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

export const Settings: React.FunctionComponent = () => {
  const routeMatch = useRouteMatch<{ submenu?: string }>()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const localizationDrawer = useLocalization().drawer
  const location = useLocation()

  const settingsItems = [
    {
      name: 'configuration',
      displayName: localizationDrawer.titles.Configuration,
      url: resolvePathParams({ path: PATHS.configuration.appPath }),
    },
    {
      name: 'stats',
      displayName: localizationDrawer.titles.Stats,
      url: resolvePathParams({ path: PATHS.settings.appPath, params: { submenu: 'stats' } }),
    },
    {
      name: 'apiKeys',
      displayName: localizationDrawer.titles.ApiAndSecurity,
      url: resolvePathParams({ path: PATHS.settings.appPath, params: { submenu: 'apikeys' } }),
    },
    {
      name: 'localization',
      displayName: localizationDrawer.titles.Localization,
      url: resolvePathParams({ path: PATHS.localization.appPath }),
    },
    {
      name: 'webHooks',
      displayName: localizationDrawer.titles.Webhooks,
      url: resolvePathParams({ path: PATHS.settings.appPath, params: { submenu: 'webhooks' } }),
    },
    {
      name: 'adminui',
      displayName: localizationDrawer.titles.AdminUiCustomization,
      url: resolvePathParams({ path: PATHS.settings.appPath, params: { submenu: 'adminui' } }),
    },
  ]

  const renderContent = () => {
    switch (routeMatch.params.submenu) {
      case 'localization':
        return <ContentComponent disableColumnSettings rootPath={PATHS.localization.snPath} />
      case 'configuration':
        return <SetupComponent />
      case 'adminui':
        return <PersonalSettingsEditor />
      case 'stats':
        return <Stats />
      case 'apikeys':
        return <ApiKeys />
      case 'webhooks':
        return (
          <ContentComponent
            rootPath={PATHS.webhooks.snPath}
            fieldsToDisplay={[
              { field: 'DisplayName' },
              { field: 'WebHookUrl' } as any,
              { field: 'Enabled' } as any,
              { field: 'SuccessfulCalls' } as any,
            ]}
            schema={'WebHookSubscription'}
          />
        )
      default:
        return (
          <div className={clsx(globalClasses.centered, classes.underConstructionWrapper)}>
            <SettingsIcon className={classes.underConstructionIcon} />
            <div>{localizationDrawer.underConstruction}</div>
          </div>
        )
    }
  }

  return (
    <div className={clsx(globalClasses.contentWrapper, classes.settingsWrapper)} style={{ paddingLeft: 0 }}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}>
        <span style={{ fontSize: '20px' }}>{localizationDrawer.titles.Settings}</span>
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
                  data-test={`drawer-submenu-item-${item.name.replace(/\s+/g, '-').toLowerCase()}`}>
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
