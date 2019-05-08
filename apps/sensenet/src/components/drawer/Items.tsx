import BuildTwoTone from '@material-ui/icons/BuildTwoTone'
import InfoTwoTone from '@material-ui/icons/InfoTwoTone'
import PeopleTwoTone from '@material-ui/icons/PeopleTwoTone'
import PublicTwoTone from '@material-ui/icons/PublicTwoTone'
import SearchTwoTone from '@material-ui/icons/SearchTwoTone'

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
    name: 'Content',
    primaryText: 'contentTitle',
    secondaryText: 'contentSecondaryText',
    url: '/browse',
    icon: <PublicTwoTone />,
    requiredGroupPath: '/Root/IMS/BuiltIn/Portal/ContentExplorers',
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
    name: 'Users and Groups',
    primaryText: 'usersAndGroupsTitle',
    secondaryText: 'usersAndGroupsSecondaryText',
    url: '/iam',
    icon: <PeopleTwoTone />,
    requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Operators',
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
