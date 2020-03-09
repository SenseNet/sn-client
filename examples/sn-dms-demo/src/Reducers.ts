import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { Actions } from '@sensenet/redux'
import { Action, AnyAction, combineReducers, Reducer } from 'redux'
import {
  ExtendedUploadProgressInfo,
  loadListActions,
  loadTypesToAddNewList,
  loadUserActions,
  loadVersions,
  setListActions,
} from './Actions'
import { resources } from './assets/resources'
import { logReducer } from './store/actionlog/reducers'
import { documentLibrary } from './store/documentlibrary/reducers'
import { editedContent } from './store/edited/reducers'
import { picker } from './store/picker/reducers'
import { queries } from './store/queries'
import { workspaces } from './store/workspaces/reducers'
import { shared } from './store/shared'

export const email: Reducer<string, Action & { email?: string }> = (state = '', action: AnyAction) => {
  switch (action.type) {
    case 'USER_REGISTRATION_REQUEST':
      return action.email || state
    case 'USER_REGISTRATION_SUCCESS':
    case 'USER_REGISTRATION_FAILURE':
      return state
    default:
      return state
  }
}
export const registrationError: Reducer<string | null, Action> = (state = null, action: AnyAction) => {
  switch (action.type) {
    case 'USER_REGISTRATION_FAILURE':
      return resources.USER_IS_ALREADY_REGISTERED
    default:
      return state
  }
}
export const isRegistering: Reducer<boolean> = (state = false, action: AnyAction) => {
  switch (action.type) {
    case 'USER_REGISTRATION_REQUEST':
      return true
    case 'USER_REGISTRATION_SUCCESS':
    case 'USER_REGISTRATION_FAILURE':
      return false
    default:
      return state
  }
}

export const registrationDone: Reducer<boolean> = (state = false, action: AnyAction) => {
  switch (action.type) {
    case 'USER_REGISTRATION_REQUEST_SUCCESS':
      return true
    case 'USER_REGISTRATION_REQUEST':
    case 'USER_REGISTRATION_FAILURE':
    case 'CLEAR_USER_REGISTRATION':
      return false
    default:
      return state
  }
}

export const register = combineReducers({
  email,
  registrationError,
  isRegistering,
  registrationDone,
})

export const open: Reducer<boolean> = (state = false, action: AnyAction) => {
  switch (action.type) {
    case 'OPEN_ACTIONMENU':
      return true
    case 'CLOSE_ACTIONMENU':
      return false
    default:
      return state
  }
}

export const actions: Reducer<ActionModel[]> = (state = [], action: AnyAction) => {
  switch (action.type) {
    case 'LOAD_CONTENT_ACTIONS_SUCCESS': {
      const result: { d: { Actions: ActionModel[] } } = (action.result as Actions.PromiseReturns<
        typeof Actions.loadContentActions
      >) as any
      return result && result.d.Actions ? result.d.Actions : []
    }
    case 'OPEN_ACTIONMENU':
      return action.actions || []
    default:
      return state
  }
}

export const id: Reducer<number | null> = (state = null, action: AnyAction) => {
  switch (action.type) {
    case 'OPEN_ACTIONMENU':
      return action.id || null
    default:
      return state
  }
}

export const title: Reducer<string, Action & { title?: string }> = (state = '', action: AnyAction) => {
  switch (action.type) {
    case 'OPEN_ACTIONMENU':
      return action.title || state
    default:
      return state
  }
}

export const anchorElement: Reducer<HTMLElement | null, Action & { element?: HTMLElement | null }> = (
  state = null,
  action: AnyAction,
) => {
  switch (action.type) {
    case 'OPEN_ACTIONMENU':
      return action.element || state
    default:
      return state
  }
}

export const position: Reducer<{ top: number; left: number }, Action & { position?: { top: number; left: number } }> = (
  state = { top: 0, left: 0 },
  action: AnyAction,
) => {
  switch (action.type) {
    case 'OPEN_ACTIONMENU':
      return action.position || null
    default:
      return state
  }
}

export const rootId: Reducer<number | null> = (state = null, action: AnyAction) => {
  switch (action.type) {
    case 'LOAD_CONTENT_SUCCESS': {
      const result = action.result as Actions.PromiseReturns<typeof Actions.loadContent>
      if (!state && result && result.d.Path.indexOf('Default_Site') === -1) {
        return result.d.Id
      } else {
        return state
      }
    }
    default:
      return state
  }
}

export const currentId: Reducer<number | null, Action & { id?: number }> = (state = null, action: AnyAction) => {
  switch (action.type) {
    case 'SET_CURRENT_ID':
      return action.id || state
    default:
      return state
  }
}

export const editedItemId: Reducer<number | null, Action & { id?: number }> = (state = null, action: AnyAction) => {
  switch (action.type) {
    case 'SET_EDITED_ID':
      return action.id || null
    case 'UPDATE_CONTENT_SUCCESS':
      return null
    default:
      return state
  }
}

export const editedFirst: Reducer<boolean, Action & { id?: number; edited?: boolean }> = (
  state = false,
  action: AnyAction,
) => {
  switch (action.type) {
    case 'SET_EDITED_ID':
      return action.id ? true : false
    case 'SET_EDITED_FIRST':
      return action.edited || state
    case 'UPDATE_CONTENT_SUCCESS':
      return false
    default:
      return state
  }
}

export interface BreadcrumbItemType {
  name: string
  id: number
  path: string
}

export const breadcrumb: Reducer<BreadcrumbItemType[]> = (state = [], action: AnyAction) => {
  switch (action.type) {
    case 'LOAD_CONTENT_SUCCESS': {
      const result = action.result as Actions.PromiseReturns<typeof Actions.loadContent>
      if (result) {
        if (result.d.Path.indexOf('Default_Site') === -1 && state.filter(e => e.id === result.d.Id).length === 0) {
          const element: BreadcrumbItemType = {
            name: result.d.DisplayName || result.d.Name,
            id: result.d.Id,
            path: result.d.Path,
          }
          return [...state, element]
        } else if (state.filter(e => e.id === result.d.Id).length > 0) {
          const index = state.findIndex(e => e.id === result.d.Id) + 1
          return [...state.slice(0, index)]
        }
      }
      return state
    }
    default:
      return state
  }
}

export const isLoading: Reducer<boolean> = (state = false, action: AnyAction) => {
  switch (action.type) {
    case 'LOAD_CONTENT_SUCCESS':
      return false
    case 'LOAD_CONTENT_REQUEST':
      return true
    default:
      return state
  }
}

export const isSelectionModeOn: Reducer<boolean> = (state = false, action: AnyAction) => {
  switch (action.type) {
    case 'SELECTION_MODE_ON':
      return true
    case 'SELECTION_MODE_OFF':
    case 'CLEAR_SELECTION':
      return false
    default:
      return state
  }
}

export const userActions: Reducer<ActionModel[]> = (state = [], action: AnyAction) => {
  switch (action.type) {
    case 'LOAD_USER_ACTIONS_SUCCESS': {
      const result = action.result as Actions.PromiseReturns<typeof loadUserActions>
      return result ? result.d.Actions : []
    }
    default:
      return state
  }
}

export const addNewTypes: Reducer<GenericContent[]> = (state = [], action: AnyAction) => {
  switch (action.type) {
    case 'LOAD_TYPES_TO_ADDNEW_LIST_SUCCESS': {
      const result = action.result as Actions.PromiseReturns<typeof loadTypesToAddNewList>
      return result ? result.d.results : []
    }
    default:
      return state
  }
}

export const actionmenuContent: Reducer<GenericContent | null> = (state = null, action: AnyAction) => {
  switch (action.type) {
    case 'OPEN_ACTIONMENU':
      return action.content
    default:
      return state
  }
}

export const breadcrumbActions: Reducer<{ actions: ActionModel[]; idOrPath: number }> = (
  state = { actions: [], idOrPath: 0 },
  action: AnyAction,
) => {
  switch (action.type) {
    case 'LOAD_BREADCRUMB_ACTIONS_SUCCESS': {
      const result = action.result.actions
      return {
        actions: result ? (result as ActionModel[]) : [],
        idOrPath: action.result.idOrPath,
      }
    }
    default:
      return state
  }
}

export const actionmenu = combineReducers({
  actions,
  open,
  anchorElement,
  position,
  content: actionmenuContent,
  title,
  userActions,
  addNewTypes,
  breadcrumb: breadcrumbActions,
})

export const toolbar: Reducer<{
  actions: ActionModel[]
  isLoading: boolean
  idOrPath: number | string
  scenario: string | undefined
}> = (state = { actions: [], isLoading: false, idOrPath: 0, scenario: '' }, action: AnyAction) => {
  switch (action.type) {
    case 'LOAD_LIST_ACTIONS': {
      const a: ReturnType<typeof loadListActions> = action as any
      return {
        ...state,
        isLoading: true,
        idOrPath: a.idOrPath,
        scenario: a.scenario,
      }
    }
    case 'SET_LIST_ACTIONS':
      return {
        ...state,
        isLoading: false,
        actions: (action as ReturnType<typeof setListActions>).actions,
      }
    default:
      return state
  }
}

export const uploads: Reducer<{ uploads: ExtendedUploadProgressInfo[]; showProgress: boolean }> = (
  state = { uploads: [], showProgress: false },
  action: AnyAction,
) => {
  switch (action.type) {
    case 'UPLOAD_ADD_ITEM':
      return {
        ...state,
        showProgress: true,
        uploads: [...state.uploads, action.uploadItem],
      }
    case 'UPLOAD_UPDATE_ITEM':
      return {
        ...state,
        uploads: state.uploads.map(uploadItem => {
          if (uploadItem.guid === action.uploadItem.guid) {
            return {
              ...uploadItem,
              ...action.uploadItem,
            }
          }
          return uploadItem
        }),
      }
    case 'UPLOAD_HIDE_ITEM':
      return {
        ...state,
        uploads: state.uploads.map(uploadItem => {
          if (uploadItem.guid === action.uploadItem.guid) {
            return {
              ...uploadItem,
              ...action.uploadItem,
              visible: false,
            }
          }
          return uploadItem
        }),
      }
    case 'UPLOAD_REMOVE_ITEM':
      return {
        ...state,
        uploads: state.uploads.filter(u => u.guid !== action.uploadItem.guid),
      }
    case 'UPLOAD_HIDE_PROGRESS':
      return {
        ...state,
        showProgress: false,
      }
    case 'UPLOAD_SHOW_PROGRESS':
      return {
        ...state,
        showProgress: false,
      }
    default:
      return state
  }
}

export const activeMenuItem: Reducer<string, Action & { itemName?: string }> = (
  state = 'documents',
  action: AnyAction,
) => {
  switch (action.type) {
    case 'CHOOSE_MENUITEM':
      return action.itemName || state
    case 'DMS_USERSANDGROUPS_SET_GROUP':
      return 'groups'
    case 'DMS_USERSANDGROUPS_SET_USER':
      return 'users'
    default:
      return state
  }
}

export const activeSubmenu: Reducer<string | null, Action & { itemName?: string }> = (
  state = null,
  action: AnyAction,
) => {
  switch (action.type) {
    case 'CHOOSE_SUBMENUITEM':
      return action.itemName || state
    default:
      return state
  }
}

export const menu = combineReducers({
  active: activeMenuItem,
  activeSubmenu,
})

export const viewer: Reducer<{ isOpened: boolean; currentDocumentId: number }, Action & { id?: number }> = (
  state = { isOpened: false, currentDocumentId: 0 },
  action: AnyAction,
) => {
  switch (action.type) {
    case 'OPEN_VIEWER':
      return {
        ...state,
        isOpened: true,
        currentDocumentId: action.id,
      }
    case 'CLOSE_VIEWER':
      return {
        ...state,
        isOpened: false,
      }
    default:
      return state
  }
}

export const isOpened: Reducer<boolean> = (state = false, action: AnyAction) => {
  switch (action.type) {
    case 'OPEN_DIALOG':
      return true
    case 'CLOSE_DIALOG':
      return false
    default:
      return state
  }
}

export const onClose: Reducer<() => void | undefined> = (state = () => undefined, action: AnyAction) => {
  switch (action.type) {
    case 'OPEN_DIALOG':
      return action.onClose
    case 'CLOSE_DIALOG':
      return null
    default:
      return state
  }
}

export const dialogContent: Reducer<React.Component | undefined> = (
  state: React.Component | null = null,
  action: AnyAction,
) => {
  switch (action.type) {
    case 'OPEN_DIALOG':
      return action.content
    case 'CLOSE_DIALOG':
      return state
    default:
      return state
  }
}

export const dialogTitle: Reducer<string> = (state = '', action: AnyAction) => {
  switch (action.type) {
    case 'OPEN_DIALOG':
      return action.title
    case 'CLOSE_DIALOG':
      return {}
    default:
      return state
  }
}

export const dialog = combineReducers({
  isOpened,
  onClose,
  content: dialogContent,
  title: dialogTitle,
})

export const versions = (state: GenericContent[] = [], action: AnyAction) => {
  switch (action.type) {
    case 'LOAD_VERSIONS_SUCCESS': {
      const versionItems = (action.result as Actions.PromiseReturns<typeof loadVersions>).d.results
      return versionItems
    }
    default:
      return state
  }
}

export const menuOpen: Reducer<boolean> = (state = false, action: AnyAction) => {
  switch (action.type) {
    case 'HANDLE_DRAWERMENU':
      return action.open
    default:
      return state || false
  }
}

export const dms = combineReducers({
  documentLibrary,
  actionmenu,
  breadcrumb,
  editedItemId,
  editedFirst,
  currentId,
  rootId,
  register,
  isLoading,
  isSelectionModeOn,
  toolbar,
  uploads,
  menu,
  viewer,
  dialog,
  workspaces,
  versions,
  picker,
  edited: editedContent,
  menuOpen,
  log: logReducer,
  queries,
  shared,
})
