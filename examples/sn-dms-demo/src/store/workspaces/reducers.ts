import { Workspace } from '@sensenet/default-content-types'
import { AnyAction, combineReducers, Reducer } from 'redux'
import { setWorkspaces } from './actions'

export const allWorkspaces: Reducer<Workspace[]> = (state = [], action: AnyAction) => {
  switch (action.type) {
    case 'SET_WORKSPACES':
      return (action as ReturnType<typeof setWorkspaces>).workspaces
    default:
      return state
  }
}

export const searchTerm: Reducer<string> = (state = '', action: AnyAction) => {
  switch (action.type) {
    case 'SEARCH_WORKSPACES':
      return action.text
    default:
      return state || ''
  }
}

export const isLoading: Reducer<boolean> = (state = false, action: AnyAction) => {
  switch (action.type) {
    case 'LOAD_WORKSPACES':
      return true
    case 'SET_WORKSPACES':
      return false
    default:
      return state
  }
}

export const workspaces = combineReducers({
  isLoading,
  all: allWorkspaces,
  searchTerm,
})
