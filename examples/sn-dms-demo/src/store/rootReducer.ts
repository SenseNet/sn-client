import { Reducers } from '@sensenet/redux'
import { combineReducers } from 'redux'
import { dms } from '../Reducers'
import { wopi } from './wopi/reducers'

const { sensenet } = Reducers

export const rootReducer = combineReducers({
  sensenet,
  dms,
  wopi,
})

export type rootStateType = ReturnType<typeof rootReducer>
