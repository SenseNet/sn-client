import { ODataWopiResponse } from '@sensenet/client-core'
import { AnyAction, Reducer } from 'redux'

const wopiDataInitialState = {
  accesstoken: '',
  actionUrl: '',
  expiration: 0,
  faviconUrl: '',
}

export const wopi: Reducer<ODataWopiResponse> = (state = wopiDataInitialState, action: AnyAction) => {
  switch (action.type) {
    case 'GET_WOPIDATA_SUCCESS':
      return action.result
    default:
      return state
  }
}
