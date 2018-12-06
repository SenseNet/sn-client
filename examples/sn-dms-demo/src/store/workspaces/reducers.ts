import { Workspace } from '@sensenet/default-content-types'
import { AnyAction, combineReducers, Reducer } from 'redux'
import { setFavoriteWorkspaces, setWorkspaces } from './actions'

export const allWorkspaces: Reducer<Workspace[]> = (state: Workspace[] = [], action: AnyAction) => {
  switch (action.type) {
    case 'SET_WORKSPACES':
      return (action as ReturnType<typeof setWorkspaces>).workspaces
    default:
      return state
  }
}

export const favorites: Reducer<number[]> = (state: number[] = [], action: AnyAction) => {
  switch (action.type) {
    case 'SET_FAVORITE_WORKSPACES':
      const items = (action as ReturnType<typeof setFavoriteWorkspaces>).workspaces
      return items.map(item => item.Id)
    case 'FOLLOW_WORKSPACE_SUCCESS':
      return [...state, action.contentId]
    case 'UNFOLLOW_WORKSPACE_SUCCESS':
      return [...state.filter(i => i !== action.contentId)]
    default:
      return state
  }
}

export const searchTerm: Reducer<string> = (state: string = '', action: AnyAction) => {
  switch (action.type) {
    case 'SEARCH_WORKSPACES':
      return action.text
    default:
      return state || ''
  }
}

export const isLoading: Reducer<boolean> = (state: boolean = false, action: AnyAction) => {
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
  favorites,
  isLoading,
  all: allWorkspaces,
  searchTerm,
})
