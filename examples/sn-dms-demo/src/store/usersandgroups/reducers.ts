import { ODataCollectionResponse, ODataParams } from '@sensenet/client-core'
import { GenericContent, Group, User } from '@sensenet/default-content-types'
import { AnyAction, combineReducers, Reducer } from 'redux'

export const currentUser: Reducer<User | null> = (state = null, action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_SET_USER':
      return action.content
    default:
      return state
  }
}

export const memberships: Reducer<ODataCollectionResponse<GenericContent>> = (
  state = { d: { __count: 0, results: [] } },
  action: AnyAction,
) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_SET_MEMBERSHIPS':
      return action.items
    case 'DMS_USERSANDGROUPS_UPDATE_GROUPS':
      return action.groups
    default:
      return state
  }
}

export const error: Reducer<any> = (state = null, action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_SET_ERROR':
      return action.error
    default:
      return state
  }
}
export const isLoading: Reducer<boolean> = (state = false, action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_LOADING':
      return true
    case 'DMS_USERSANDGROUPS_FINISH_LOADING':
      return false
    default:
      return state
  }
}

export const isAdmin: Reducer<boolean> = (state = false, action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USER_ISADMIN':
      return action.admin
    default:
      return state
  }
}

export const ancestors: Reducer<GenericContent[]> = (state = [], action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_SET_ANCESTORS':
      return action.ancestors
    default:
      return state
  }
}

export const selected: Reducer<GenericContent[]> = (state = [], action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_SET_ANCESTORS':
      return action.ancestors
    default:
      return state
  }
}

export const loadChunkSize = 25

const defaultOptions = {
  select: [
    'Id',
    'Path',
    'Name',
    'Type',
    'ParentId',
    'Actions',
    'Avatar',
    'Owner',
    'DisplayName',
    'Workspace',
    'Icon',
    'Members',
  ],
  expand: ['Actions', 'Workspace', 'Members'],
  orderby: [['IsFolder', 'desc'], ['DisplayName', 'asc']],
  filter: `isOf('Group')`,
  top: loadChunkSize,
} as ODataParams<GenericContent>

export const grouplistOptions: Reducer<ODataParams<GenericContent>> = (state = defaultOptions, action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_SET_CHILDREN_OPTIONS':
      return action.odataOptions
    default:
      return state
  }
}

export const active: Reducer<GenericContent | null> = (state = null, action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_SET_ACTIVE':
      return action.active
    default:
      return state
  }
}

export const allUsers: Reducer<GenericContent[]> = (state = [], action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_SET_USERS':
      return action.users.d.results
    default:
      return state
  }
}

export const userSearchTerm: Reducer<string> = (state = '', action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_SEARCH_USERS':
      return action.text
    default:
      return state
  }
}

export const user = combineReducers({
  currentUser,
  isAdmin,
  memberships,
  error,
  isLoading,
  ancestors,
  selected,
  grouplistOptions,
  active,
  all: allUsers,
  searchTerm: userSearchTerm,
})

export const selectedGroups: Reducer<GenericContent[]> = (state = [], action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_SELECT_GROUP':
      return [...action.groups]
    case 'DMS_USERSANDGROUPS_DESELECT_GROUP':
      const index = state.findIndex(data => data.Id === action.id)
      return [...state.slice(0, index), ...state.slice(index + 1)]
    case 'DMS_USERSANDGROUPS_CLEAR_SELECTION':
    case 'DMS_USERSANDGROUPS_SEARCH_GROUPS':
      return []
    default:
      return state
  }
}

export const all: Reducer<GenericContent[]> = (state = [], action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_SET_GROUPS':
      return action.groups.d.results
    default:
      return state
  }
}

export const searchTerm: Reducer<string> = (state = '', action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_SEARCH_GROUPS':
      return action.text
    default:
      return state
  }
}

export const currentGroup: Reducer<Group | null> = (state = null, action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_SET_GROUP':
      const g = action.content
      if (action.content.Name === 'Root') {
        g.DisplayName = 'Groups'
      }
      return g
    default:
      return state
  }
}

export const groupAncestors: Reducer<GenericContent[]> = (state = [], action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_SET_GROUPANCESTORS':
      return action.ancestors
    default:
      return state
  }
}

export const groupList: Reducer<GenericContent[]> = (state = [], action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_SET_GROUP':
      return action.items
    default:
      return state
  }
}

export const groupsAreLoading: Reducer<boolean> = (state = false, action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_LOADING':
      return true
    case 'DMS_USERSANDGROUPS_FINISH_LOADING':
      return false
    default:
      return state
  }
}

export const parent: Reducer<GenericContent | null> = (state = null, action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_SET_GROUP':
      return action.content
    default:
      return state
  }
}

export const parentIdOrPath: Reducer<string | number> = (state = '', action: AnyAction) => {
  switch (action.type) {
    case 'DMS_USERSANDGROUPS_LOADING':
      return action.idOrPath
    default:
      return state
  }
}

export const allowedTypes: Reducer<GenericContent[]> = (state = [], action: AnyAction) => {
  switch (action.type) {
    case 'DMS_DOCLIB_SET_ALLOWED_TYPES':
      return action.types
    default:
      return state
  }
}

export const group = combineReducers({
  selected: selectedGroups,
  all,
  searchTerm,
  currentGroup,
  ancestors: groupAncestors,
  groupList,
  isLoading: groupsAreLoading,
  grouplistOptions,
  parent,
  parentIdOrPath,
})

export const usersAndGroups = combineReducers({
  user,
  group,
  allowedTypes,
})
