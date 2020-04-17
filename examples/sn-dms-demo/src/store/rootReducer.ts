import { Reducers } from '@sensenet/redux'
import { combineReducers } from 'redux'
import { reducer } from 'redux-oidc'
import { dms } from '../Reducers'
import { wopi } from './wopi/reducers'

const { sensenet } = Reducers

export const rootReducer = combineReducers({
  sensenet,
  dms,
  wopi,
  auth: reducer,
})

export type rootStateType = ReturnType<typeof rootReducer>
