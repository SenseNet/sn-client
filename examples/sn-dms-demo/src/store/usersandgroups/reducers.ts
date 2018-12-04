import { IODataCollectionResponse, IODataParams } from '@sensenet/client-core'
import { GenericContent, User } from '@sensenet/default-content-types'
import { AnyAction, combineReducers, Reducer } from 'redux'

export const currentUser: Reducer<User | undefined> = (state: User | null = null, action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SET_USER':
            return action.content
        default:
            return state
    }
}

export const memberships: Reducer<IODataCollectionResponse<GenericContent>> = (state: IODataCollectionResponse<GenericContent> = { d: { __count: 0, results: [] } }, action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SET_MEMBERSHIPS':
            return action.items
        case 'DMS_USERSANDGROUPS_UPDATE_GROUPS':
            return action.groups
        default:
            return state
    }
}

export const error: Reducer<any> = (state: any = null, action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SET_ERROR':
            return action.error
        default:
            return state
    }
}
export const isLoading: Reducer<boolean> = (state: boolean = false, action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_LOADING':
            return true
        case 'DMS_USERSANDGROUPS_FINISH_LOADING':
            return false
        default:
            return state
    }
}

export const isAdmin: Reducer<boolean> = (state: boolean = false, action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USER_ISADMIN':
            return action.admin
        default:
            return state
    }
}

export const ancestors: Reducer<GenericContent[]> = (state: GenericContent[] = [], action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SET_ANCESTORS':
            return action.ancestors
        default:
            return state
    }
}

export const selected: Reducer<GenericContent[]> = (state: GenericContent[] = [], action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SET_ANCESTORS':
            return action.ancestors
        default:
            return state
    }
}

export const loadChunkSize = 25

const defaultOptions = {
    select: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'Actions', 'Avatar', 'Owner', 'DisplayName', 'Workspace', 'Icon', 'Members'],
    expand: ['Actions', 'Workspace', 'Members'],
    orderby: [['IsFolder', 'desc'], ['DisplayName', 'asc']],
    filter: `isOf('Group')`,
    top: loadChunkSize,
} as IODataParams<GenericContent>

export const grouplistOptions: Reducer<IODataParams<GenericContent>> = (state: IODataParams<GenericContent> = defaultOptions, action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SET_CHILDREN_OPTIONS':
            return action.odataOptions
        default:
            return state
    }
}

export const active: Reducer<GenericContent | null> = (state: GenericContent | null = null, action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SET_ACTIVE':
            return action.active
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
})

export const selectedGroups: Reducer<GenericContent[]> = (state: GenericContent[] = [], action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SELECT_GROUP':
            return [
                ...action.groups]
        case 'DMS_USERSANDGROUPS_DESELECT_GROUP':
            const index = state.findIndex((data) => data.Id === action.id)
            return [...state.slice(0, index), ...state.slice(index + 1)]
        case 'DMS_USERSANDGROUPS_CLEAR_SELECTION':
        case 'DMS_USERSANDGROUPS_SEARCH_GROUPS':
            return []
        default:
            return state
    }
}

export const all: Reducer<GenericContent[]> = (state: GenericContent[] = [], action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SET_GROUPS':
            return action.groups.d.results
        default:
            return state
    }
}

export const searchTerm: Reducer<string> = (state: string = '', action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SEARCH_GROUPS':
            return action.text
        default:
            return state
    }
}

export const group = combineReducers({
    selected: selectedGroups,
    all,
    searchTerm,
})

export const usersAndGroups = combineReducers({
    user,
    group,
})
