import { Status } from '@sensenet/default-content-types'
import { Reducers } from '@sensenet/redux'
import { combineReducers } from 'redux'

export const createList = filter => {
  const handleToggle = (state, action, f) => {
    const { Id } = action.payload
    const shouldRemove =
      (Status[0] === Status.active && f !== 'active' && f !== 'all') ||
      (Status[0] === Status.completed && f !== 'completed' && f !== 'all')
    return shouldRemove ? state.filter(id => id !== Id) : state
  }
  const ids = (state = [], action) => {
    switch (action.type) {
      case 'FETCH_CONTENT_SUCCESS':
        return action.payload.result
      case 'CREATE_CONTENT_SUCCESS':
        return [...state, action.payload.result]
      case 'UPDATE_CONTENT_SUCCESS':
        return handleToggle(state, action, filter)
      case 'DELETE_CONTENT_SUCCESS':
        const index = state.indexOf(action.id)
        return [...state.slice(0, index), ...state.slice(index + 1)]
      default:
        return state
    }
  }
  const isFetching = (state = false, action) => {
    switch (action.type) {
      case 'FETCH_CONTENT_REQUEST':
        return true
      case 'FETCH_CONTENT_SUCCESS':
      case 'FETCH_CONTENT_FAILURE':
        return false
      default:
        return state
    }
  }

  const errorMessage = (state: any = null, action: any) => {
    switch (action.type) {
      case 'FETCH_CONTENT_FAILURE':
        return 'An error occured'
      case 'FETCH_CONTENT_REQUEST':
      case 'FETCH_CONTENT_SUCCESS':
        return null
      default:
        return state
    }
  }

  return combineReducers({
    ids,
    isFetching,
    errorMessage,
  })
}

const visibilityFilter = (state = 'All', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

export const listByFilter = combineReducers({
  All: createList('all'),
  Active: createList('active'),
  Completed: createList('completed'),
  VisibilityFilter: visibilityFilter,
})

export const getVisibleTodos = (state, filter) => {
  const ids = Reducers.getIds(state.listByFilter[filter])
  return ids.map(id => Reducers.getContent(state.sensenet.children.entities, id))
}

export const getIsFetching = (state, filter) => Reducers.getFetching(state.listByFilter[filter])

export const getErrorMessage = (state, filter) => Reducers.getError(state.listByFilter[filter])

export const getVisibilityFilter = state => state.sensenet.children.filter

export const setVisibilityFilter = filter => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter,
  }
}
