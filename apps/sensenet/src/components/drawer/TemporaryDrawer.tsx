import { SwipeableDrawer } from '@material-ui/core'
import { Close, PowerSettingsNew, Settings } from '@material-ui/icons'
import { useRepository, useSession } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PATHS, resolvePathParams } from '../../application-paths'
import { ResponsiveContext, ResponsivePersonalSettings } from '../../context'
import { useDrawerItems, useLocalization, useTheme } from '../../hooks'
import { useDialog } from '../dialogs'
import { UserAvatar } from '../UserAvatar'
import { PermanentDrawerItem } from './PermanentDrawerItem'
import { RepositorySelector } from './repository-selector'
import './app-navigation.css'

type TemporaryDrawerProps = {
  isOpened: boolean
  onClose: () => void
  onOpen: () => void
}

export const TemporaryDrawer = (props: TemporaryDrawerProps) => {
  const settings = useContext(ResponsivePersonalSettings)
  const device = useContext(ResponsiveContext)
  const repo = useRepository()
  const location = useLocation()
  const theme = useTheme()
  const session = useSession()
  const items = useDrawerItems().filter((item) => item.itemType !== 'Favorites')
  const localization = useLocalization()
  const { openDialog } = useDialog()
  const close = useRef(props.onClose)
  close.current = props.onClose
  const baseItems = items.filter((item) => !item.systemItem)
  const systemItems = items.filter((item) => item.systemItem)

  useEffect(() => close.current(), [location.pathname, location.search])

  if (!settings.drawer.enabled) return null

  return (
    <SwipeableDrawer
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        id: 'app-navigation-drawer',
        className: `sn-app-navigation sn-app-navigation--expanded sn-app-navigation--overlay theme-${theme.palette.type}`,
        'aria-label': localization.drawer.navigationTitle,
      }}
      BackdropProps={{ className: 'sn-app-navigation-backdrop', 'data-test': 'app-navigation-backdrop' } as any}
      open={props.isOpened}
      onClose={props.onClose}
      onOpen={props.onOpen}>
      <div className="sn-app-navigation__header">
        <span className="sn-app-navigation__title">{localization.drawer.navigationTitle}</span>
        <button
          type="button"
          className="sn-app-navigation__toggle"
          title={localization.drawer.closeNavigation}
          aria-label={localization.drawer.closeNavigation}
          onClick={props.onClose}
          data-test="app-navigation-close">
          <Close />
        </button>
      </div>
      <RepositorySelector />
      <nav className="sn-app-navigation__sections" aria-label={localization.drawer.navigationTitle}>
        <ul className="sn-app-navigation__items">
          {baseItems.map((item) => (
            <li key={`${item.itemType}-${item.url}`}>
              <PermanentDrawerItem item={item} opened onNavigate={props.onClose} />
            </li>
          ))}
        </ul>
        {systemItems.length > 0 && (
          <div className="sn-app-navigation__system">
            <div className="sn-app-navigation__group-title">{localization.drawer.titles.System}</div>
            <ul className="sn-app-navigation__items">
              {systemItems.map((item) => (
                <li key={`${item.itemType}-${item.url}`}>
                  <PermanentDrawerItem item={item} opened onNavigate={props.onClose} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
      <div className="sn-app-navigation__account">
        <UserAvatar
          repositoryUrl={repo.configuration.repositoryUrl}
          user={session.currentUser}
          style={{ width: 32, height: 32, fontSize: 14 }}
        />
        <div className="sn-app-navigation__account-text">
          <span>{session.currentUser.DisplayName || session.currentUser.Name}</span>
          <small title={repo.configuration.repositoryUrl}>{repo.configuration.repositoryUrl}</small>
        </div>
        <div className="sn-app-navigation__account-actions">
          {device !== 'mobile' && (
            <Link
              className="sn-app-navigation__toggle"
              to={resolvePathParams({ path: PATHS.settings.appPath, params: { submenu: 'adminui' } })}
              title={localization.drawer.personalSettingsTitle}
              aria-label={localization.drawer.personalSettingsTitle}
              onClick={props.onClose}>
              <Settings />
            </Link>
          )}
          <button
            type="button"
            className="sn-app-navigation__toggle"
            title={localization.logout.logoutButtonTitle}
            aria-label={localization.logout.logoutButtonTitle}
            data-test="app-navigation-logout"
            onClick={() => {
              props.onClose()
              openDialog({ name: 'logout' })
            }}>
            <PowerSettingsNew />
          </button>
        </div>
      </div>
    </SwipeableDrawer>
  )
}
