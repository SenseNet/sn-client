import { ODataCollectionResponse, Repository } from '@sensenet/client-core'
import { createAction, isFromAction } from '@sensenet/redux'
import { Reducer } from 'redux'
import { IInjectableActionCallbackParams } from 'redux-di-middleware'
import Semaphore from 'semaphore-async-await'
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

export const share = createAction(
  (
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
  }),
)

export const shareFailed = createAction((idOrPath: string | number, error: any) => ({
  type: 'DMS_SHARE_FAILED',
  idOrPath,
  error,
}))

export const sharingEntryReceived = createAction((idOrPath: number | string, entry: SharingEntry) => ({
  type: 'DMS_SHARING_ENTRY_RECEIVED',
  idOrPath,
  entry,
}))

export const sharingEntriesReceived = createAction((idOrPath: number | string, entries: SharingEntry[]) => ({
  type: 'DMS_SHARING_ENTRIES_RECEIVED',
  idOrPath,
  entries,
}))

const loadLock = new Semaphore(1)
export const getSharingEntries = createAction((idOrPath: number | string) => ({
  type: 'DMS_GET_SHARING_ENTRIES',
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    const repo = options.getInjectable(Repository)
    try {
      await loadLock.acquire()
      const result = await repo.executeAction<undefined, ODataCollectionResponse<SharingEntry>>({
        idOrPath,
        name: 'GetSharing',
        method: 'GET',
        body: undefined,
      })
      options.dispatch(sharingEntriesReceived(idOrPath, result.d.results))
    } catch (error) {
      options.dispatch(getSharingEntriesFailed(idOrPath, error))
    } finally {
      loadLock.release()
    }
  },
}))

export const getSharingEntriesFailed = createAction((idOrPath: string | number, error: any) => ({
  type: 'DMS_GET_SHARING_ENTRIES_FAILED',
  idOrPath,
  error,
}))

export type SharingStateType = Record<string | number, Record<string, SharingEntry>>

export const sharing: Reducer<SharingStateType> = (state = {}, action) => {
  if (isFromAction(action, sharingEntryReceived)) {
    if (!state[action.idOrPath]) {
      state[action.idOrPath] = {}
    }
    state[action.idOrPath][action.entry.Id] = action.entry
    return {
      ...state,
    }
  }

  if (isFromAction(action, sharingEntriesReceived)) {
    if (!state[action.idOrPath]) {
      state[action.idOrPath] = {}
    }
    for (const entry of action.entries) {
      state[action.idOrPath][entry.Id] = entry
    }
    return {
      ...state,
    }
  }
  return state
}
