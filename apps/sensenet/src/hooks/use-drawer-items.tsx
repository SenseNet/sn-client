import React, { useCallback, useContext, useEffect, useState } from 'react'
import BuildTwoTone from '@material-ui/icons/BuildTwoTone'
import LanguageTwoTone from '@material-ui/icons/LanguageTwoTone'
import PeopleTwoTone from '@material-ui/icons/PeopleTwoTone'
import PublicTwoTone from '@material-ui/icons/PublicTwoTone'
import SearchTwoTone from '@material-ui/icons/SearchTwoTone'
import WidgetsTwoTone from '@material-ui/icons/WidgetsTwoTone'
import { DashboardTwoTone, DeleteTwoTone } from '@material-ui/icons'
import { useRepository, useSession } from '@sensenet/hooks-react'
import { LoginState } from '@sensenet/client-core'
import { Icon } from '../components/Icon'
import {
  BuiltinDrawerItem,
  ContentDrawerItem,
  DashboardDrawerItem,
  DrawerItem as DrawerItemSetting,
  QueryDrawerItem,
} from '../services/PersonalSettings'
import { ResponsivePersonalSetttings } from '../context'
import { encodeBrowseData } from '../components/content'
import { encodeQueryData } from '../components/search'
import DefaultLocalization from '../localization/default'
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

export const useDrawerItems = () => {
  const session = useSession()
  const settings = useContext(ResponsivePersonalSetttings)
  const localization = useLocalization().drawer
  const repo = useRepository()

  const [drawerItems, setDrawerItems] = useState<DrawerItem[]>([])

  const getItemNameFromSettings = useCallback(
    (item: DrawerItemSetting<any>) => {
      return (
        (item.settings && item.settings.title) ||
        localization.titles[item.itemType as keyof typeof localization.titles] ||
        '!NO TITLE!'
      )
    },
    [localization],
  )

  const getItemDescriptionFromSettings = useCallback(
    (item: DrawerItemSetting<any>) => {
      return (
        (item.settings && item.settings.description) ||
        localization.descriptions[item.itemType as keyof typeof localization.titles]
      )
    },
    [localization],
  )

  const getRootFromSetting = useCallback(
    (item: ContentDrawerItem | QueryDrawerItem | BuiltinDrawerItem | DashboardDrawerItem) => {
      switch (item.itemType) {
        case 'Search':
          return undefined
        case 'Content':
          return '/Root/Content'
        case 'Users and groups':
          return '/Root/IMS/Public'
        case 'Trash':
          return '/Root/Trash'
        case 'Content Types':
          return '/Root/System/Schema/ContentTypes'
        case 'Localization':
          return '/Root/Localization'
        case 'Setup':
          return '/Root/System/Settings'
        case 'Dashboard':
          return undefined
        default:
          return undefined
      }
    },
    [],
  )

  const getIconFromSetting = useCallback(
    (item: ContentDrawerItem | QueryDrawerItem | BuiltinDrawerItem | DashboardDrawerItem) => {
      switch (item.itemType) {
        case 'Search':
          return <SearchTwoTone />
        case 'Content':
          return item.settings && item.settings.icon ? (
            <Icon item={{ ContentTypeName: item.settings.icon }} />
          ) : (
            <PublicTwoTone />
          )
        case 'Users and groups':
          return <PeopleTwoTone />
        case 'Content Types':
          return <WidgetsTwoTone />
        case 'Localization':
          return <LanguageTwoTone />
        case 'Trash':
          return <DeleteTwoTone />
        case 'Setup':
          return <BuildTwoTone />
        case 'Dashboard':
          return <DashboardTwoTone />
        default:
          return (
            <Icon item={item.settings && item.settings.icon ? { ContentTypeName: item.settings.icon } : { item }} />
          )
      }
    },
    [],
  )

  const getUrlFromSetting = useCallback(
    (item: ContentDrawerItem | QueryDrawerItem | BuiltinDrawerItem | DashboardDrawerItem) => {
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
          return `/browse/${encodeBrowseData({
            type: 'simple',
            root: '/Root/IMS/Public',
            fieldsToDisplay: ['DisplayName', 'ModificationDate', 'ModifiedBy', 'Actions'],
          })}`
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
          return `/browse/${encodeBrowseData({
            type: 'simple',
            root: '/Root/Localization',
          })}`
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
    },
    [settings.content.browseType, settings.content.fields, localization],
  )

  const getItemFromSettings = useCallback(
    (setting: DrawerItemSetting<any>) => {
      const drawerItem: DrawerItem = {
        icon: getIconFromSetting(setting),
        primaryText: getItemNameFromSettings(setting),
        secondaryText: getItemDescriptionFromSettings(setting),
        name: setting.itemType,
        requiredGroupPath: '',
        url: getUrlFromSetting(setting),
        root: getRootFromSetting(setting),
      }
      return drawerItem
    },
    [
      getIconFromSetting,
      getItemDescriptionFromSettings,
      getItemNameFromSettings,
      getRootFromSetting,
      getUrlFromSetting,
    ],
  )

  useEffect(() => {
    settings.drawer.items
      .filter(() => session.state === LoginState.Authenticated)
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
          return false
        }
        return true
      })
      .then(items => setDrawerItems(items.map(item => getItemFromSettings(item))))
  }, [getItemFromSettings, repo, repo.security, session, settings])

  return drawerItems
}
