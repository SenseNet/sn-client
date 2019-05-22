import { GenericContent } from '@sensenet/default-content-types'
import { createContent, PromiseReturns } from '@sensenet/redux/dist/Actions'
import { AnyAction, combineReducers, Reducer } from 'redux'

export const pickerIsOpened: Reducer<boolean> = (state = false, action: AnyAction) => {
  switch (action.type) {
    case 'OPEN_PICKER':
      return true
    case 'CLOSE_PICKER':
      return false
    default:
      return state
  }
}

export const pickerOnClose: Reducer<any> = (state = null, action: AnyAction) => {
  switch (action.type) {
    case 'OPEN_PICKER':
      return action.onClose
    case 'CLOSE_PICKER':
      return null
    default:
      return state
  }
}

export const pickerContent: Reducer<GenericContent | null> = (state = null, action: AnyAction) => {
  switch (action.type) {
    case 'OPEN_PICKER':
      return action.content
    case 'CLOSE_PICKER':
      return state
    default:
      return state
  }
}

export const pickerParent: Reducer<GenericContent | null> = (state = null, action: AnyAction) => {
  switch (action.type) {
    case 'SET_PICKER_PARENT':
      return action.content
    default:
      return state
  }
}

export const pickerItems: Reducer<GenericContent[]> = (state = [], action: AnyAction) => {
  switch (action.type) {
    case 'CREATE_CONTENT_SUCCESS':
      const newContent = (action.result as PromiseReturns<typeof createContent>).d
      return [...state, newContent]
    default:
      return state
  }
}

export const pickerSelected: Reducer<GenericContent[]> = (state = [], action: AnyAction) => {
  switch (action.type) {
    case 'SELECT_PICKER_ITEM':
      return action.content ? [action.content] : []
    case 'DESELECT_PICKER_ITEM':
      return []
    default:
      return state
  }
}

export const pickerMode: Reducer<string> = (state = 'move', action: AnyAction) => {
  switch (action.type) {
    case 'OPEN_PICKER':
      return action.mode
    default:
      return state
  }
}

export const closestWorkspace: Reducer<GenericContent | null> = (state = null, action: AnyAction) => {
  switch (action.type) {
    case 'SET_PICKER_PARENT':
      return action.content.Workspace.Path
    default:
      return state
  }
}

export const backLink: Reducer<boolean> = (state = true, action: AnyAction) => {
  switch (action.type) {
    case 'SET_BACKLINK':
      return action.state
    default:
      return state
  }
}

export const picker = combineReducers({
  isOpened: pickerIsOpened,
  pickerOnClose,
  content: pickerContent,
  parent: pickerParent,
  items: pickerItems,
  selected: pickerSelected,
  closestWorkspace,
  backLink,
  mode: pickerMode,
})
