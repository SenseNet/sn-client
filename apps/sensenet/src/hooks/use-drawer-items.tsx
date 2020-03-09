import { Build, Dashboard, Delete, Language, People, Public, Search, Widgets } from '@material-ui/icons'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useState } from 'react'
import { encodeBrowseData } from '../components/content'
import { Icon } from '../components/Icon'
import { encodeQueryData } from '../components/search'
import { ResponsivePersonalSetttings } from '../context'
import DefaultLocalization from '../localization/default'
import {
  BuiltinDrawerItem,
  ContentDrawerItem,
  DashboardDrawerItem,
  DrawerItem as DrawerItemSetting,
  QueryDrawerItem,
} from '../services/PersonalSettings'
import { useLocalization } from '.'

export interface DrawerItem {
  name: string
  primaryText: keyof typeof DefaultLocalization.drawer.titles
  secondaryText: keyof typeof DefaultLocalization.drawer.descriptions
  url: string
  icon: JSX.Element
  requiredGroupPath: string
  root?: string
}

type EveryDrawerType = ContentDrawerItem | QueryDrawerItem | BuiltinDrawerItem | DashboardDrawerItem

export const useDrawerItems = () => {
  const settings = useContext(ResponsivePersonalSetttings)
  const localization = useLocalization().drawer
  const repo = useRepository()
  const logger = useLogger('use-drawer-items')

  const [drawerItems, setDrawerItems] = useState<DrawerItem[]>([])

  useEffect(() => {
    const getItemNameFromSettings = (item: DrawerItemSetting<any>) => {
      return item.settings?.title || localization.titles[item.itemType] || '!NO TITLE!'
    }

    const getItemDescriptionFromSettings = (item: DrawerItemSetting<any>) => {
      return item.settings?.description || localization.descriptions[item.itemType]
    }

    const getIconFromSetting = (item: EveryDrawerType) => {
      switch (item.itemType) {
        case 'Search':
          return <Search />
        case 'Content':
          return item.settings && item.settings.icon ? (
            <Icon item={{ ContentTypeName: item.settings.icon }} />
          ) : (
            <Public />
          )
        case 'Users and groups':
          return <People />
        case 'Content Types':
          return <Widgets />
        case 'Localization':
          return <Language />
        case 'Trash':
          return <Delete />
        case 'Setup':
          return <Build />
        case 'Dashboard':
          return <Dashboard />
        default:
          return (
            <Icon item={item.settings && item.settings.icon ? { ContentTypeName: item.settings.icon } : { item }} />
          )
      }
    }

    const getUrlFromSetting = (item: EveryDrawerType) => {
      switch (item.itemType) {
        case 'Search':
          return '/saved-queries'
        case 'Content':
          return `/browse/${encodeBrowseData({
            type: (item.settings && item.settings.browseType) || settings.content.browseType,
            root: (item.settings && item.settings.root) || '/Root/Content',
            secondaryContent: (item.settings && item.settings.root) || '/Root/Content',
            fieldsToDisplay: (item.settings && item.settings.columns) || settings.content.fields,
          })}`
        case 'Users and groups':
          return '/usersAndGroups'
        case 'Content Types':
          return `/search/${encodeQueryData({
            title: localization.titles['Content Types'],
            term: "+TypeIs:'ContentType'",
            hideSearchBar: true,
            fieldsToDisplay: ['DisplayName', 'Description', 'ParentTypeName' as any, 'ModificationDate', 'ModifiedBy'],
            showAddButton: true,
            parentPath: '/Root/System/Schema/ContentTypes/',
            allowedTypes: ['ContentType'],
          })}`
        case 'Query':
          return `/search/${encodeQueryData({
            term: (item.settings && item.settings.term) || '',
            title: item.settings && item.settings.title,
            hideSearchBar: true,
            fieldsToDisplay: item.settings && item.settings.columns,
          })}`
        case 'Localization':
          return '/localization'
        case 'Trash':
          return '/trash'
        case 'Setup':
          return '/setup'
        case 'Dashboard':
          return `/dashboard/${encodeURIComponent(item.settings ? item.settings.dashboardName : '')}`
        default:
          // return ''
          break
      }

      return '/'
    }
    const getItemFromSettings = (setting: DrawerItemSetting<any>) => {
      const drawerItem: DrawerItem = {
        icon: getIconFromSetting(setting),
        primaryText: getItemNameFromSettings(setting),
        secondaryText: getItemDescriptionFromSettings(setting),
        name: setting.itemType,
        requiredGroupPath: '',
        url: getUrlFromSetting(setting),
        root: setting.settings?.root,
      }
      return drawerItem
    }
    settings.drawer.items
      .filterAsync(async item => {
        if (!item.permissions || !item.permissions.length) {
          return true
        }
        try {
          for (const permission of item.permissions) {
            const actions = await repo.getActions({ idOrPath: permission.path })
            const actionIndex = actions.d.Actions.findIndex(action => action.Name === permission.action)
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
      .then(items => setDrawerItems(items.map(item => getItemFromSettings(item))))
  }, [
    localization.descriptions,
    localization.titles,
    logger,
    repo,
    settings.content.browseType,
    settings.content.fields,
    settings.drawer.items,
  ])

  return drawerItems
}
