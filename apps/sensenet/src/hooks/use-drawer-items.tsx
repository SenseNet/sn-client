import { useLogger, useRepository } from '@sensenet/hooks-react'
import { Build, Delete, Folder, Language, People, Public, Search, Widgets } from '@material-ui/icons'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { PATHS, resolvePathParams } from '../application-paths'
import { Icon } from '../components/Icon'
import { ResponsivePersonalSettings } from '../context'
import { CustomContentDrawerItem, DrawerItem as DrawerItemSetting } from '../services/PersonalSettings'
import { useLocalization } from '.'

export interface DrawerItem {
  primaryText: string
  secondaryText: string
  url: string
  icon: JSX.Element
  root?: string
}

type DrawerType = CustomContentDrawerItem | DrawerItemSetting<any>

export const useDrawerItems = () => {
  const settings = useContext(ResponsivePersonalSettings)
  const localization = useLocalization().drawer
  const repo = useRepository()
  const logger = useLogger('use-drawer-items')

  const [drawerItems, setDrawerItems] = useState<DrawerItem[]>([])

  const builtInDrawerItems: Array<DrawerItemSetting<any>> = useMemo(
    () => [
      {
        itemType: 'Search',
      },
      {
        itemType: 'Content',
        settings: { root: PATHS.content.snPath },
        permissions: [
          {
            path: PATHS.content.snPath,
            action: 'Browse',
          },
        ],
      },
      {
        itemType: 'UsersAndGroups',
        settings: { root: PATHS.usersAndGroups.snPath },
        permissions: [
          {
            path: PATHS.usersAndGroups.snPath,
            action: 'Add',
          },
        ],
      },
      {
        itemType: 'Trash',
        settings: { root: PATHS.trash.snPath },
        permissions: [
          {
            path: PATHS.trash.snPath,
            action: 'Edit',
          },
        ],
      },
      {
        itemType: 'ContentTypes',
        settings: { root: PATHS.contentTypes.snPath },
        permissions: [
          {
            path: PATHS.contentTypes.snPath,
            action: 'Add',
          },
        ],
      },
      {
        itemType: 'Localization',
        settings: { root: PATHS.localization.snPath },
        permissions: [
          {
            path: PATHS.localization.snPath,
            action: 'Add',
          },
        ],
      },
      {
        itemType: 'Setup',
        settings: { root: PATHS.setup.snPath },
        permissions: [
          {
            path: PATHS.setup.snPath,
            action: 'Browse',
          },
        ],
      },
    ],
    [],
  )

  useEffect(() => {
    const getItemNameFromSettings = (item: DrawerItemSetting<any>) => {
      return item.settings?.title || localization.titles[item.itemType] || '!NO TITLE!'
    }

    const getItemDescriptionFromSettings = (item: DrawerItemSetting<any>) => {
      return item.settings?.description || localization.descriptions[item.itemType]
    }

    const getIconFromSetting = (item: DrawerType) => {
      switch (item.itemType) {
        case 'Search':
          return <Search />
        case 'Content':
          return <Public />
        case 'UsersAndGroups':
          return <People />
        case 'Trash':
          return <Delete />
        case 'ContentTypes':
          return <Widgets />
        case 'Localization':
          return <Language />
        case 'Setup':
          return <Build />
        case 'CustomContent':
          return item.settings?.icon ? <Icon item={{ ContentTypeName: item.settings.icon }} /> : <Folder />
        // no default
      }
    }

    const getUrlFromSetting = (item: DrawerType) => {
      switch (item.itemType) {
        case 'Search':
          return resolvePathParams({ path: PATHS.savedQueries.appPath })
        case 'Content':
          return resolvePathParams({
            path: PATHS.content.appPath,
            params: { browseType: settings.content.browseType },
          })
        case 'UsersAndGroups':
          return resolvePathParams({
            path: PATHS.usersAndGroups.appPath,
            params: { browseType: settings.content.browseType },
          })
        case 'Trash':
          return resolvePathParams({
            path: PATHS.trash.appPath,
            params: { browseType: settings.content.browseType },
          })
        case 'ContentTypes':
          return resolvePathParams({
            path: PATHS.contentTypes.appPath,
            params: { browseType: settings.content.browseType },
          })
        case 'Localization':
          return resolvePathParams({
            path: PATHS.localization.appPath,
            params: { browseType: settings.content.browseType },
          })
        case 'Setup':
          return resolvePathParams({ path: PATHS.setup.appPath })
        case 'CustomContent':
          return resolvePathParams({
            path: PATHS.custom.appPath,
            params: {
              browseType: settings.content.browseType,
              path: (item as CustomContentDrawerItem).settings?.appPath || '',
            },
          })
        default:
          return '/'
      }
    }

    const getItemFromSettings = (setting: DrawerItemSetting<any>) => {
      const drawerItem: DrawerItem = {
        icon: getIconFromSetting(setting),
        primaryText: getItemNameFromSettings(setting),
        secondaryText: getItemDescriptionFromSettings(setting),
        url: getUrlFromSetting(setting),
        root: setting.settings?.root,
      }
      return drawerItem
    }

    ;[...builtInDrawerItems, ...settings.drawer.items]
      .filterAsync(async (item) => {
        if (!item.permissions?.length) {
          return true
        }
        try {
          for (const permission of item.permissions) {
            const actions = await repo.getActions({ idOrPath: permission.path })
            const actionIndex = actions.d.results.findIndex((action) => action.Name === permission.action)
            if (actionIndex === -1 || actions.d.results[actionIndex].Forbidden) {
              return false
            }
          }
        } catch (error) {
          logger.debug({
            message: error.message,
            data: {
              details: { error },
            },
          })
          return false
        }
        return true
      })
      .then((items) => setDrawerItems(items.map(getItemFromSettings)))
  }, [
    localization.descriptions,
    localization.titles,
    logger,
    repo,
    settings.content,
    settings.content.fields,
    settings.drawer.items,
    builtInDrawerItems,
  ])

  return drawerItems
}
