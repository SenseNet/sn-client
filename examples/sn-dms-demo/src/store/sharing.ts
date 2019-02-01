import { ODataCollectionResponse, Repository } from '@sensenet/client-core'
import { Reducer } from 'redux'
import { IInjectableActionCallbackParams } from 'redux-di-middleware'
import { rootStateType } from './rootReducer'

export interface SharingEntry {
  Id: string
  Token: string
  Identity: 0
  Mode: 'Private' | 'Authenticated' | 'Public'
  Level: 'Open' | 'Edit'
  CreatorId: number
  ShareDate: string
}

export const share = (
  idOrPath: number | string,
  token: string,
  level: SharingEntry['Level'],
  mode: SharingEntry['Mode'],
  sendNotification: boolean = false,
) => ({
  type: 'DMS_SHARE_CONTENT',
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    const repo = options.getInjectable(Repository)
    try {
      const entry = await repo.executeAction<{}, SharingEntry>({
        method: 'POST',
        name: 'Share',
        oDataOptions: {},
        idOrPath,
        body: { token, level, mode, sendNotification },
      })
      options.dispatch(sharingEntryReceived(idOrPath, entry))
    } catch (error) {
      options.dispatch(shareFailed(idOrPath, error))
    }
  },
})

export const shareFailed = (idOrPath: string | number, error: any) => ({
  type: 'DMS_SHARE_FAILED',
  idOrPath,
  error,
})

export const sharingEntryReceived = (idOrPath: number | string, entry: SharingEntry) => ({
  type: 'DMS_SHARING_ENTRY_RECEIVED',
  idOrPath,
  entry,
})

export const sharingEntriesReceived = (idOrPath: number | string, entries: SharingEntry[]) => ({
  type: 'DMS_SHARING_ENTRIES_RECEIVED',
  idOrPath,
  entries,
})

export const getSharingEntries = (idOrPath: number | string) => ({
  type: 'DMS_GET_SHARING_ENTRIES',
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    const repo = options.getInjectable(Repository)
    try {
      const result = await repo.executeAction<undefined, ODataCollectionResponse<SharingEntry>>({
        idOrPath,
        name: 'GetSharing',
        method: 'GET',
        body: undefined,
      })
      options.dispatch(sharingEntriesReceived(idOrPath, result.d.results))
    } catch (error) {
      options.dispatch(getSharingEntriesFailed(idOrPath, error))
    }
  },
})

export const getSharingEntriesFailed = (idOrPath: string | number, error: any) => ({
  type: 'DMS_GET_SHARING_ENTRIES_FAILED',
  idOrPath,
  error,
})

export type SharingStateType = Record<string | number, Record<string, SharingEntry>>

export const sharing: Reducer<SharingStateType> = (state = {}, action) => {
  switch (action.type) {
    case 'DMS_SHARING_ENTRY_RECEIVED':
      const entryAction = action as ReturnType<typeof sharingEntryReceived>
      const idOrPath = entryAction.idOrPath
      const entryId = entryAction.entry.Id
      if (!state[idOrPath]) {
        state[idOrPath] = {}
      }
      state[idOrPath][entryId] = entryAction.entry
      return {
        ...state,
      }
    case 'DMS_SHARING_ENTRIES_RECEIVED':
      const entriesAction = action as ReturnType<typeof sharingEntriesReceived>
      const entriesIdOrPath = entriesAction.idOrPath
      if (!state[entriesIdOrPath]) {
        state[entriesIdOrPath] = {}
      }
      for (const entry of entriesAction.entries) {
        state[entriesIdOrPath][entry.Id] = entry
      }
      return {
        ...state,
      }
  }
  return state
}
