import { useTheme } from '@material-ui/core/styles'
import { ChevronLeft, Menu } from '@material-ui/icons'
import React, { useContext, useState } from 'react'
import { ResponsivePersonalSettings } from '../../context'
import { useDrawerItems, useLocalization } from '../../hooks'
import { PermanentDrawerItem } from './PermanentDrawerItem'
import { RepositorySelector } from './repository-selector'
import './app-navigation.css'

export const PermanentDrawer = () => {
  const settings = useContext(ResponsivePersonalSettings)
  const [opened, setOpened] = useState(settings.drawer.type === 'permanent')
  const items = useDrawerItems().filter((item) => item.itemType !== 'Favorites')
  const localization = useLocalization().drawer
  const theme = useTheme()
  const baseItems = items.filter((item) => !item.systemItem && item.itemType !== 'Settings')
  const systemItems = items.filter((item) => item.systemItem)

  if (!settings.drawer.enabled) return null

  return (
    <nav
      className={`sn-app-navigation theme-${theme.palette.type}${opened ? ' sn-app-navigation--expanded' : ''}`}
      aria-label={localization.navigationTitle}
      data-test="drawer"
      data-expanded={opened}>
      <div className="sn-app-navigation__header">
        {settings.drawer.type === 'mini-variant' ? (
          <button
            type="button"
            className="sn-app-navigation__toggle"
            title={opened ? localization.collapse : localization.expand}
            aria-label={opened ? localization.collapse : localization.expand}
            aria-expanded={opened}
            onClick={() => setOpened(!opened)}
            data-test="drawer-expandcollapse-button">
            {opened ? <ChevronLeft /> : <Menu />}
          </button>
        ) : null}
        {opened && <span className="sn-app-navigation__title">{localization.navigationTitle}</span>}
      </div>
      {opened && <RepositorySelector />}
      <div className="sn-app-navigation__sections">
        <ul className="sn-app-navigation__items">
          {baseItems.map((item) => (
            <li key={`${item.itemType}-${item.url}`}>
              <PermanentDrawerItem item={item} opened={opened} />
            </li>
          ))}
        </ul>
        {systemItems.length > 0 && (
          <div className="sn-app-navigation__system">
            {opened && <div className="sn-app-navigation__group-title">{localization.titles.System}</div>}
            <ul className="sn-app-navigation__items">
              {systemItems.map((item) => (
                <li key={`${item.itemType}-${item.url}`}>
                  <PermanentDrawerItem item={item} opened={opened} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}
