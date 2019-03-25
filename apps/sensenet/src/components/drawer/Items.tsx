import BuildTwoTone from '@material-ui/icons/BuildTwoTone'
import InfoTwoTone from '@material-ui/icons/InfoTwoTone'
import PeopleTwoTone from '@material-ui/icons/PeopleTwoTone'
import PublicTwoTone from '@material-ui/icons/PublicTwoTone'
import SearchTwoTone from '@material-ui/icons/SearchTwoTone'

import { Group } from '@sensenet/default-content-types'
import React from 'react'

export interface DrawerItem {
  primaryText: string
  secondaryText: string
  url: string
  icon: JSX.Element
  requiredGroupPath: string
}

export const defaultDrawerItems: DrawerItem[] = [
  {
    primaryText: 'Content',
    secondaryText: 'Explore the Repository',
    url: '/browse',
    icon: <PublicTwoTone />,
    requiredGroupPath: '/Root/IMS/BuiltIn/Portal/ContentExplorers',
  },
  {
    primaryText: 'Search',
    secondaryText: 'Build queries',
    url: '/search',
    icon: <SearchTwoTone />,
    requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Operators',
  },
  {
    primaryText: 'Users and Groups',
    secondaryText: 'Manage users and groups, roles and identities',
    url: '/iam',
    icon: <PeopleTwoTone />,
    requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Operators',
  },
  {
    primaryText: 'Setup',
    secondaryText: 'Configure the sensenet system',
    url: '/setup',
    icon: <BuildTwoTone />,
    requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Administrators',
  },
  {
    primaryText: 'Version info',
    secondaryText: 'Detailed version information about the current sensenet installation',
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
