import { ODataWopiResponse } from '@sensenet/client-core'
import { AnyAction, combineReducers, Reducer } from 'redux'

const wopiDataInitialState = {
  accesstoken: '',
  actionUrl: '',
  expiration: 0,
  faviconUrl: '',
}

export const wopiData: Reducer<ODataWopiResponse> = (state = wopiDataInitialState, action: AnyAction) => {
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
