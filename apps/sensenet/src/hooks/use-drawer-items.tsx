import React, { useCallback, useContext, useEffect, useState } from 'react'
import BuildTwoTone from '@material-ui/icons/BuildTwoTone'
import InfoTwoTone from '@material-ui/icons/InfoTwoTone'
import LanguageTwoTone from '@material-ui/icons/LanguageTwoTone'
import PeopleTwoTone from '@material-ui/icons/PeopleTwoTone'
import PublicTwoTone from '@material-ui/icons/PublicTwoTone'
import SearchTwoTone from '@material-ui/icons/SearchTwoTone'
import WidgetsTwoTone from '@material-ui/icons/WidgetsTwoTone'
import { DrawerItem } from '../components/drawer/Items'
import { Icon } from '../components/Icon'
import {
  BuiltinDrawerItem,
  ContentDrawerItem,
  DrawerItem as DrawerItemSetting,
  QueryDrawerItem,
} from '../services/PersonalSettings'
import { ResponsivePersonalSetttings } from '../context'
import { encodeBrowseData } from '../components/content'
import { useSession } from './use-session'
import { useLocalization } from './use-localization'

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

  const getIconFromSetting = useCallback((item: ContentDrawerItem | QueryDrawerItem | BuiltinDrawerItem) => {
    switch (item.itemType) {
      case 'Search':
        return <SearchTwoTone />
      case 'Content':
        return item.settings.icon ? <Icon item={{ ContentType: item.settings.icon }} /> : <PublicTwoTone />
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
      default:
        return <Icon item={item.settings && item.settings.icon ? { ContentTypeName: item.settings.icon } : { item }} />
    }
  }, [])

  const getUrlFromSetting = useCallback(
    (item: ContentDrawerItem | QueryDrawerItem | BuiltinDrawerItem) => {
      switch (item.itemType) {
        case 'Search':
          return '/saved-queries'
        case 'Content':
          return `/browse/${encodeBrowseData({
            type: item.settings.browseType || settings.content.browseType,
            root: item.settings.root,
            secondaryContent: item.settings.root,
          })}`
        case 'Users and groups':
          return `/browse/${encodeBrowseData({
            type: settings.content.browseType,
            root: '/Root/IMS',
            fieldsToDisplay: ['DisplayName', 'Type'],
          })}`
        case 'Content Types':
          return `/search/${encodeURIComponent('+TypeIs:ContentType')}`
        case 'Query':
          return `/search/${encodeURIComponent(item.settings.term)}`
        case 'Localization':
          return `/browse/${encodeBrowseData({
            type: settings.content.browseType,
            root: '/Root/Localization',
          })}`
        case 'Trash':
          return '' // ToDO
        case 'Setup':
          return '/setup'
        case 'Version info':
          return '/info'
        default:
          // return ''
          break
      }

      return '/'
    },
    [settings.content.browseType],
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
