import { ODataParams, Repository } from '@sensenet/client-core'
import { Query } from '@sensenet/default-content-types'
import { createAction, isFromAction } from '@sensenet/redux'
import { deleteContent, PromiseReturns, updateContent } from '@sensenet/redux/dist/Actions'
import { Reducer } from 'redux'
import { IInjectableActionCallbackParams } from 'redux-di-middleware'
import { rootStateType } from './rootReducer'

export type QueryType = 'Private' | 'Public' | 'NonDefined'

export const queriesRequested = createAction((idOrPath: string | number, queryType = 'Private') => ({
  type: 'SN_DMS_DEMO_QUERIES_REQUESTED',
  idOrPath,
  queryType,
}))

export const queriesReceived = createAction((receivedQueries: Query[]) => ({
  type: 'SN_DMS_DEMO_QUERIES_RECEIVED',
  receivedQueries,
}))

export const select = createAction(<T extends Query>(selected: T[]) => ({
  type: 'SN_DMS_DEMO_QUERIES_SELECT',
  selected,
}))

export const setActive = createAction(<T extends Query>(active?: T) => ({
  type: 'SN_DMS_DEMO_QUERIES_SET_ACTIVE',
  active,
}))

export const saveQuery = createAction(
  (idOrPath: string | number, query: string, displayName: string, queryType = 'Private') => ({
    type: 'SN_DMS_SAVE_QUERY',
    inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
      const repo = options.getInjectable(Repository)
      await repo.executeAction({
        idOrPath,
        name: 'SaveQuery',
        method: 'POST',
        body: {
          query,
          displayName,
          queryType,
        },
      })
      options.dispatch(queriesRequested(0, 'Private'))
    },
  }),
)

export const getQueries = createAction((idOrPath: string | number, queryType = 'Private', force = false) => ({
  type: 'SN_DMS_GET_QUERIES',
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    const state = options.getState()
    if (force === false && state.dms.queries.idOrPath === idOrPath && state.dms.queries.queryType === queryType) {
      return
    }
    options.dispatch(queriesRequested(idOrPath, queryType))
    const repo = options.getInjectable(Repository)
    const q = await repo.executeAction<undefined, { d: { results: Query[] } }>({
      idOrPath,
      name: 'GetQueries',
      method: 'GET',
      oDataOptions: {
        select: ['Query', 'Icon'],
        scenario: 'DMSListItem',
        onlyPublic: queryType === 'Public' ? true : false,
      } as any,
      body: undefined,
    })
    options.dispatch(queriesReceived(q.d.results))
  },
}))

export interface QueriesType {
  idOrPath: number | string
  queryType: QueryType
  queries: Query[]
  selected: Query[]
  active?: Query
  childrenOptions: ODataParams<Query>
}

export const queries: Reducer<QueriesType> = (
  state = { idOrPath: 0, queries: [], selected: [], queryType: 'Private', childrenOptions: {} },
  action,
) => {
  if (isFromAction(action, queriesReceived)) {
    return {
      ...state,
      queries: action.receivedQueries,
    }
  }
  if (isFromAction(action, queriesRequested)) {
    return {
      ...state,
      idOrPath: action.idOrPath,
      queryType: action.queryType,
    }
  }
  if (isFromAction(action, select)) {
    return { ...state, selected: action.selected }
  }
  if (isFromAction(action, setActive)) {
    return {
      ...state,
      active: action.active,
    }
  }
  /** todo: auto-generated success action from @sn/redux */
  if (action.type === 'UPDATE_CONTENT_SUCCESS') {
    return {
      ...state,
      queries: state.queries.map(c => {
        if (c.Id === (action.result as PromiseReturns<typeof updateContent>).d.Id) {
          return action.result.d
        }
        return c
      }),
    }
  }
  /** todo: auto-generated success action from @sn/redux */
  if (action.type === 'DELETE_CONTENT_SUCCESS') {
    const deletedIds = (action.result as PromiseReturns<typeof deleteContent>).d.results.map(d => d.Id)
    return {
      ...state,
      queries: [...state.queries.filter(q => !(deletedIds as any).includes(q.Id))],
    }
  }
  return state
}
