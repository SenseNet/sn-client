import { combineReducers, Reducer } from 'redux'
import { SharingLevel, SharingMode } from '@sensenet/client-core/src'

export interface SharingEntry {
  Id: string
  Token: string
  Identity: 0
  Mode: SharingMode
  Level: SharingLevel
  CreatorId: number
  ShareDate: string
}

export const sharingEntries: Reducer<SharingEntry[]> = (state = [], action) => {
  switch (action.type) {
    case 'GET_SHARING_ENTRIES_SUCCESS':
      for (const entry of action.result.d.results) {
        state[entry.Id] = entry
      }
      return {
        ...state,
      }
    default:
      return state
  }
}

/**
 * Reducer combining sharing related reducers in one.
 */
export const sharing = combineReducers<{
  sharingEntries: ReturnType<typeof sharingEntries>
}>({
  sharingEntries,
})
