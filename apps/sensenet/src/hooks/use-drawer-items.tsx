import { useLogger, useRepository } from '@sensenet/hooks-react'
import { Build, Dashboard, Delete, Folder, Language, People, Public, Search, Widgets } from '@material-ui/icons'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { PATHS, resolvePathParams } from '../application-paths'
import { Icon } from '../components/Icon'
import { ResponsivePersonalSettings } from '../context'
import { pathWithQueryParams } from '../services'
import {
  CustomContentDrawerItem,
  DashboardDrawerItem,
  CustomDrawerItem as DrawerItemSetting,
  QueryDrawerItem,
} from '../services/PersonalSettings'
import { useLocalization } from '.'

export interface DrawerItem {
  primaryText: string
  secondaryText: string
  url: string
  icon: JSX.Element
  root?: string
}

type CustomDrawerType = QueryDrawerItem | DashboardDrawerItem | CustomContentDrawerItem

export const useDrawerItems = () => {
  const settings = useContext(ResponsivePersonalSettings)
  const localization = useLocalization().drawer
  const repo = useRepository()
  const logger = useLogger('use-drawer-items')

  const [drawerItems, setDrawerItems] = useState<DrawerItem[]>([])

  const builtInDrawerItems: DrawerItem[] = useMemo(
    () => [
      {
        icon: <Search />,
        primaryText: localization.titles.Search,
        secondaryText: localization.descriptions.Search,
        url: PATHS.savedQueries.appPath,
        root: PATHS.savedQueries.snPath,
      },
      {
        icon: <Public />,
        primaryText: localization.titles.Content,
        secondaryText: localization.descriptions.Content,
        url: resolvePathParams({
          path: PATHS.content.appPath,
          params: { browseType: settings.content.browseType },
        }),
        root: PATHS.content.snPath,
      },
      {
        icon: <People />,
        primaryText: localization.titles.UsersAndGroups,
        secondaryText: localization.descriptions.UsersAndGroups,
        url: resolvePathParams({
          path: PATHS.usersAndGroups.appPath,
          params: { browseType: settings.content.browseType },
        }),
        root: PATHS.usersAndGroups.snPath,
      },
      {
        icon: <Delete />,
        primaryText: localization.titles.Trash,
        secondaryText: localization.descriptions.Trash,
        url: resolvePathParams({
          path: PATHS.trash.appPath,
          params: { browseType: settings.content.browseType },
        }),
        root: PATHS.trash.snPath,
      },
      {
        icon: <Widgets />,
        primaryText: localization.titles.ContentTypes,
        secondaryText: localization.descriptions.ContentTypes,
        url: resolvePathParams({
          path: PATHS.contentTypes.appPath,
          params: { browseType: settings.content.browseType },
        }),
        root: PATHS.contentTypes.snPath,
      },
      {
        icon: <Language />,
        primaryText: localization.titles.Localization,
        secondaryText: localization.descriptions.Localization,
        url: resolvePathParams({
          path: PATHS.localization.appPath,
          params: { browseType: settings.content.browseType },
        }),
        root: PATHS.localization.snPath,
      },
      {
        icon: <Build />,
        primaryText: localization.titles.Setup,
        secondaryText: localization.descriptions.Setup,
        url: PATHS.setup.appPath,
        root: PATHS.setup.snPath,
      },
    ],
    [localization, settings.content.browseType],
  )

  useEffect(() => {
    const getItemNameFromSettings = (item: DrawerItemSetting<any>) => {
      return item.settings?.title || localization.titles[item.itemType] || '!NO TITLE!'
    }

    const getItemDescriptionFromSettings = (item: DrawerItemSetting<any>) => {
      return item.settings?.description || localization.descriptions[item.itemType]
    }

    const getIconFromSetting = (item: CustomDrawerType) => {
      switch (item.itemType) {
        case 'CustomContent':
          return <Folder />
        case 'Dashboard':
          return <Dashboard />
        default:
          return (
            <Icon item={item.settings && item.settings.icon ? { ContentTypeName: item.settings.icon } : { item }} />
          )
      }
    }

    const getUrlFromSetting = (item: CustomDrawerType) => {
      switch (item.itemType) {
        case 'Query':
          return pathWithQueryParams({
            path: PATHS.search.appPath,
            newParams: { term: item.settings?.term },
          })
        case 'Dashboard':
          return resolvePathParams({
            path: PATHS.dashboard.appPath,
            params: { dashboardName: encodeURIComponent(item.settings?.dashboardName ?? '') },
          })
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

    settings.drawer.items
      .filterAsync(async (item) => {
        if (!item.permissions?.length) {
          return true
        }
        try {
          for (const permission of item.permissions) {
            const actions = await repo.getActions({ idOrPath: permission.path })
            const actionIndex = actions.d.Actions.findIndex((action) => action.Name === permission.action)
            if (actionIndex === -1 || actions.d.Actions[actionIndex].Forbidden) {
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
      .then((items) => setDrawerItems([...builtInDrawerItems, ...items.map(getItemFromSettings)]))
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
