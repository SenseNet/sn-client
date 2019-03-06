import { combineReducers } from 'redux'
import { createCollectionState } from './CollectionState'

export const left = createCollectionState({
  getSelfState: (state: any) => state.commander.left,
  prefix: 'COMMANDER_LEFT',
})

export const right = createCollectionState({
  getSelfState: (state: any) => state.commander.right,
  prefix: 'COMMANDER_RIGHT',
})

export const commander = combineReducers({
  left: left.reducer,
  right: right.reducer,
})
