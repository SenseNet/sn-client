import { Reducer } from 'redux'
import { v1 } from 'uuid'
import { addLogEntry, LogEntry, readLogEntries } from './actions'

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
    switch (action.type) {
        case 'SN_DMS_INIT_LOG':
            return {
                ...state,
                isInitialized: true,
            }
        case 'SN_DMS_ADD_LOG_ENTRY':
            return {
                ...state,
                entries: [
                    ...state.entries,
                    {
                        ...(action as ReturnType<typeof addLogEntry>).entry,
                        created: new Date(),
                        unread: true,
                        uuid: v1(),
                    },
                ],
            }
        case 'SN_DMS_READ_LOG_ENTRIES':
            return {
                ...state,
                entries: state.entries.map((e) => {
                    const a = action as ReturnType<typeof readLogEntries>
                    if (a.entries.find((actionEntry) => actionEntry.uuid === e.uuid)) {
                        return {
                            ...e,
                            unread: false,
                        }
                    }
                    return e
                }),
            }
        default:
            return state
    }
}
