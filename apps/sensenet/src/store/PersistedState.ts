import { Repository } from '@sensenet/client-core'
import { Reducer } from 'redux'
import { AnyAction } from 'redux'
import { createAction, isFromAction } from './ActionHelpers'

export interface PersistedStateType {
  lastUserName: string
  lastRepositoryUrl: string
}

export const setPersistedState = createAction((state: PersistedStateType, repo: Repository) => ({
  type: 'setPersistedState',
  state,
  // tslint:disable-next-line: no-unnecessary-type-annotation
  inject: () => {
    repo.configuration.repositoryUrl = state.lastRepositoryUrl
  },
}))

const persistedStateFromStorage = localStorage.getItem('sensenet-admin')
const persistedStateParsed: PersistedStateType = persistedStateFromStorage
  ? persistedStateFromStorage && JSON.parse(persistedStateFromStorage)
  : { lastUserName: '', lastRepositoryUrl: '' }

export const persistedState: Reducer<PersistedStateType, AnyAction> = (
  state = persistedStateParsed,
  action: AnyAction,
) => {
  if (isFromAction(action, setPersistedState)) {
    localStorage.setItem('sensenet-admin', JSON.stringify(action.state))
    return { ...action.state }
  }
  return state
}
