import { AnyAction, combineReducers, Reducer } from 'redux'
import { WopiDataEntry } from '../services'

export const wopiData: Reducer<WopiDataEntry> = (
  state = { accesstoken: '', actionUrl: '', expiration: 0, faviconUrl: '' },
  action: AnyAction,
) => {
  switch (action.type) {
    case 'GET_WOPIDATA_SUCCESS':
      return action.result
    default:
      return state
  }
}

export const wopi = combineReducers({
  wopiData,
})
