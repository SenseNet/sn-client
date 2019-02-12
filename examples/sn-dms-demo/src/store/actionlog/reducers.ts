import { isFromAction } from '@sensenet/redux'
import { Reducer } from 'redux'
import { v1 } from 'uuid'
import { addLogEntry, initLog, LogEntry, readLogEntries } from './actions'

export interface LogStateType {
  isInitialized: boolean
  entries: LogEntry[]
  lastReadDate: Date
}

export const defaultLogState: LogStateType = {
  isInitialized: false,
  lastReadDate: new Date(0),
  entries: [
    {
      created: new Date(),
      dump: {},
      unread: false,
      messageEntry: {
        message: 'Log initialized',
        verbosity: 'info',
      },
      uuid: v1(),
    },
  ],
}

export const logReducer: Reducer<LogStateType> = (state = defaultLogState, action) => {
  if (isFromAction(action, initLog)) {
    return {
      ...state,
      isInitialized: true,
    }
  }
  if (isFromAction(action, addLogEntry)) {
    return {
      ...state,
      entries: [
        ...state.entries,
        {
          ...action.entry,
          created: new Date(),
          unread: true,
          uuid: v1(),
        },
      ],
    }
  }
  if (isFromAction(action, readLogEntries)) {
    return {
      ...state,
      entries: state.entries.map(e => {
        if (action.entries.find(actionEntry => actionEntry.uuid === e.uuid)) {
          return {
            ...e,
            unread: false,
          }
        }
        return e
      }),
    }
  }
  return state
}
