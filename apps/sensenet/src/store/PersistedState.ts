import { Reducer } from 'redux'
import { AnyAction } from 'redux'
import { createAction, isFromAction } from './ActionHelpers'

export interface PersistedStateType {
  lastUserName: string
  lastRepositoryUrl: string
}

export const setPersistedState = createAction((state: PersistedStateType) => ({
  type: 'setPersistedState',
  state,
}))

export const persistedState: Reducer<PersistedStateType, AnyAction> = (
  state = { lastUserName: '', lastRepositoryUrl: '' },
  action: AnyAction,
) => {
  if (isFromAction(action, setPersistedState)) {
    localStorage.setItem('sensenet-admin', JSON.stringify(action.state))
    return action.state
  }
  return state
}
