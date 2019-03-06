import BuildTwoTone from '@material-ui/icons/BuildTwoTone'
import PeopleTwoTone from '@material-ui/icons/PeopleTwoTone'
import PublicTwoTone from '@material-ui/icons/PublicTwoTone'
import SearchTwoTone from '@material-ui/icons/SearchTwoTone'
import React from 'react'
import { AnyAction, Reducer } from 'redux'
import { createAction, isFromAction } from './ActionHelpers'
import { setGroups } from './Session'

export interface DrawerItem {
  primaryText: string
  secondaryText: string
  url: string
  icon: JSX.Element
  requiredGroupPath: string
}

export const setDrawerItems = createAction((items: DrawerItem[]) => ({
  type: 'SET_DRAWER_ITEMS',
  items,
}))

const defaultDrawerItems: DrawerItem[] = [
  {
    primaryText: 'Content',
    secondaryText: 'Explore the Repository',
    url: '/content',
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
]

export const toggleDrawer = createAction(() => ({ type: 'toggleDrawer' }))

export const drawer: Reducer<{ items: DrawerItem[]; opened: boolean }> = (
  state = { items: [], opened: false },
  action: AnyAction,
) => {
  if (isFromAction(action, toggleDrawer)) {
    return {
      ...state,
      opened: !state.opened,
    }
  }
  if (isFromAction(action, setDrawerItems)) {
    return {
      ...state,
      items: action.items,
    }
  }
  if (isFromAction(action, setGroups)) {
    return {
      ...state,
      items: defaultDrawerItems.filter(
        i => i.requiredGroupPath && (action.groups.find(g => g.Path === i.requiredGroupPath) ? true : false),
      ),
    }
  }
  return state
}
