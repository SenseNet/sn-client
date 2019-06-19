import BuildTwoTone from '@material-ui/icons/BuildTwoTone'
import DashboardTwoTone from '@material-ui/icons/DashboardTwoTone'
import InfoTwoTone from '@material-ui/icons/InfoTwoTone'
import LanguageTwoTone from '@material-ui/icons/LanguageTwoTone'
import PeopleTwoTone from '@material-ui/icons/PeopleTwoTone'
import PublicTwoTone from '@material-ui/icons/PublicTwoTone'
import SearchTwoTone from '@material-ui/icons/SearchTwoTone'
import WidgetsTwoTone from '@material-ui/icons/WidgetsTwoTone'

import { Group } from '@sensenet/default-content-types'
import React from 'react'
import DefaultLocalization from '../../localization/default'

export interface DrawerItem {
  name: string
  primaryText: keyof (typeof DefaultLocalization.drawer)
  secondaryText: keyof (typeof DefaultLocalization.drawer)
  url: string
  icon: JSX.Element
  requiredGroupPath: string
}

export const defaultDrawerItems: DrawerItem[] = [
  {
    name: 'Dashboard',
    primaryText: 'dashboardTitle',
    secondaryText: 'dashboardSecondaryText',
    url: '/dashboard',
    icon: <DashboardTwoTone />,
    requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Operators',
  },
  {
    name: 'Search',
    primaryText: 'searchTitle',
    secondaryText: 'searchSecondaryText',
    url: '/saved-queries',
    icon: <SearchTwoTone />,
    requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Operators',
  },
  {
    name: 'Content',
    primaryText: 'contentTitle',
    secondaryText: 'contentSecondaryText',
    url: '/browse',
    icon: <PublicTwoTone />,
    requiredGroupPath: '/Root/IMS/BuiltIn/Portal/ContentExplorers',
  },
  {
    name: 'Users and Groups',
    primaryText: 'usersAndGroupsTitle',
    secondaryText: 'usersAndGroupsSecondaryText',
    url: '/iam',
    icon: <PeopleTwoTone />,
    requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Operators',
  },
  {
    name: 'Content Types',
    primaryText: 'contentTypesTitle',
    secondaryText: 'contentTypesSecondaryText',
    url: '/content-types',
    icon: <WidgetsTwoTone />,
    requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Administrators',
  },
  {
    name: 'Localization',
    primaryText: 'localizationTitle',
    secondaryText: 'localizationSecondaryText',
    url: '/localization',
    icon: <LanguageTwoTone />,
    requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Administrators',
  },
  {
    name: 'Trash',
    primaryText: 'trashTitle',
    secondaryText: 'trashSecondaryText',
    url: '/trash',
    icon: <InfoTwoTone />,
    requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Administrators',
  },
  {
    name: 'Setup',
    primaryText: 'setupTitle',
    secondaryText: 'setupSecondaryText',
    url: '/setup',
    icon: <BuildTwoTone />,
    requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Administrators',
  },
  {
    name: 'Version info',
    primaryText: 'versionInfoTitle',
    secondaryText: 'versionInfoSecondaryText',
    url: '/info',
    icon: <InfoTwoTone />,
    requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Administrators',
  },
]

export const getAllowedDrawerItems = (groups: Group[]) => {
  return defaultDrawerItems.filter(
    i => i.requiredGroupPath && (groups.find(g => g.Path === i.requiredGroupPath) ? true : false),
  )
}
