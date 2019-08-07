import React, { useCallback, useContext, useEffect, useState } from 'react'
import BuildTwoTone from '@material-ui/icons/BuildTwoTone'
import InfoTwoTone from '@material-ui/icons/InfoTwoTone'
import LanguageTwoTone from '@material-ui/icons/LanguageTwoTone'
import PeopleTwoTone from '@material-ui/icons/PeopleTwoTone'
import PublicTwoTone from '@material-ui/icons/PublicTwoTone'
import SearchTwoTone from '@material-ui/icons/SearchTwoTone'
import WidgetsTwoTone from '@material-ui/icons/WidgetsTwoTone'
import { DashboardTwoTone } from '@material-ui/icons'
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
import { useSession } from './use-session'
import { useLocalization } from './use-localization'

export interface DrawerItem {
  name: string
  primaryText: keyof (typeof DefaultLocalization.drawer.titles)
  secondaryText: keyof (typeof DefaultLocalization.drawer.descriptions)
  url: string
  icon: JSX.Element
  requiredGroupPath: string
}

export const useDrawerItems = () => {
  const session = useSession()
  const settings = useContext(ResponsivePersonalSetttings)
  const localization = useLocalization().drawer

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
          return <InfoTwoTone />
        case 'Setup':
          return <BuildTwoTone />
        case 'Version info':
          return <InfoTwoTone />
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
            fieldsToDisplay: item.settings.columns || settings.content.fields,
          })}`
        case 'Users and groups':
          return `/search/${encodeQueryData({
            title: localization.titles['Users and groups'],
            term: "+TypeIs:'User' OR TypeIs:'Group'",
            hideSearchBar: true,
            fieldsToDisplay: ['DisplayName', 'ModificationDate', 'ModifiedBy', 'Actions'],
          })}`
        case 'Content Types':
          return `/search/${encodeQueryData({
            title: localization.titles['Content Types'],
            term: "+TypeIs:'ContentType'",
            hideSearchBar: true,
            fieldsToDisplay: ['DisplayName', 'Description', 'ParentTypeName' as any, 'ModificationDate', 'ModifiedBy'],
          })}`
        case 'Query':
          return `/search/${encodeQueryData({
            term: item.settings.term,
            title: item.settings.title,
            hideSearchBar: true,
            fieldsToDisplay: item.settings.columns,
          })}`
        case 'Localization':
          return `/search/${encodeQueryData({
            term: "+TypeIs:'Resource'",
            title: localization.titles.Localization,
            hideSearchBar: true,
          })}`
        case 'Trash':
          return '' // ToDO
        case 'Setup':
          return '/setup'
        case 'Version info':
          return '/info'
        case 'Dashboard':
          return `/dashboard/${encodeURIComponent(item.settings.dashboardName)}`
        default:
          // return ''
          break
      }

      return '/'
    },
    [localization.titles, settings.content.browseType, settings.content.fields],
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
      }
      return drawerItem
    },
    [getIconFromSetting, getItemDescriptionFromSettings, getItemNameFromSettings, getUrlFromSetting],
  )

  useEffect(() => {
    setDrawerItems(settings.drawer.items.map(item => getItemFromSettings(item)))
  }, [getItemFromSettings, session, settings])

  return drawerItems
}
