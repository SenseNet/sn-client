import { ODataSharingResponse } from '@sensenet/client-core'
import { combineReducers, Reducer } from 'redux'

export const sharingEntries: Reducer<ODataSharingResponse[]> = (state = [], action) => {
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
