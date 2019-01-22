import { ODataBatchResponse, ODataParams, Repository } from '@sensenet/client-core'
import { Query } from '@sensenet/default-content-types'
import { deleteContent, PromiseReturns, updateContent } from '@sensenet/redux/dist/Actions'
import { AnyAction, Reducer } from 'redux'
import { InjectableAction } from 'redux-di-middleware'
import { rootStateType } from './rootReducer'

export type QueryType = 'Private' | 'Public' | 'NonDefined'

export const saveQuery: (
  idOrPath: string | number,
  query: string,
  displayName: string,
  queryType: QueryType,
) => InjectableAction<rootStateType, AnyAction> = (
  idOrPath: string | number,
  query: string,
  displayName: string,
  queryType = 'Private',
) => ({
  type: 'SN_DMS_SAVE_QUERY',
  inject: async options => {
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
})

export const getQueries: (
  idOrPath: string | number,
  queryType: QueryType,
  force?: boolean,
) => InjectableAction<rootStateType, AnyAction> = (
  idOrPath: string | number,
  queryType = 'Private',
  force: boolean = false,
) => ({
  type: 'SN_DMS_GET_QUERIES',
  inject: async options => {
    const state = options.getState()
    if (force === false && state.dms.queries.idOrPath === idOrPath && state.dms.queries.queryType === queryType) {
      return
    }
    options.dispatch(queriesRequested(idOrPath, queryType))
    const repo = options.getInjectable(Repository)
    const q: ODataBatchResponse<Query> = await repo.executeAction({
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
})

export const queriesRequested = (idOrPath: string | number, queryType = 'Private') => ({
  type: 'SN_DMS_DEMO_QUERIES_REQUESTED',
  idOrPath,
  queryType,
})

export const queriesReceived = (q: Query[]) => ({
  type: 'SN_DMS_DEMO_QUERIES_RECEIVED',
  q,
})

export const select = <T extends Query>(selected: T[]) => ({
  type: 'SN_DMS_DEMO_QUERIES_SELECT',
  selected,
})

export const setActive = <T extends Query>(active?: T) => ({
  type: 'SN_DMS_DEMO_QUERIES_SET_ACTIVE',
  active,
})

interface QueriesType {
  idOrPath: number | string
  queryType: QueryType
  queries: Query[]
  selected: Query[]
  active?: Query
  childrenOptions: ODataParams<Query>
}

export const queries: Reducer<QueriesType> = (
  state = { idOrPath: 0, queries: [], selected: [], queryType: 'Private', childrenOptions: {} },
  action: AnyAction,
) => {
  switch (action.type) {
    case 'SN_DMS_DEMO_QUERIES_RECEIVED':
      return {
        ...state,
        queries: action.q,
      }
    case 'SN_DMS_DEMO_QUERIES_REQUESTED':
      return {
        ...state,
        idOrPath: action.idOrPath,
        queryType: action.queryType,
      }
    case 'SN_DMS_DEMO_QUERIES_SELECT':
      return {
        ...state,
        selected: action.selected,
      }
    case 'SN_DMS_DEMO_QUERIES_SET_ACTIVE':
      return {
        ...state,
        active: action.active,
      }
    case 'UPDATE_CONTENT_SUCCESS':
      return {
        ...state,
        queries: state.queries.map(c => {
          if (c.Id === (action.result as PromiseReturns<typeof updateContent>).d.Id) {
            return action.result.d
          }
          return c
        }),
      }
    case 'DELETE_BATCH_SUCCESS':
    case 'DELETE_CONTENT_SUCCESS':
      const deletedIds = (action.result as PromiseReturns<typeof deleteContent>).d.results.map(d => d.Id)
      return {
        ...state,
        queries: [...state.queries.filter(q => !(deletedIds as any).includes(q.Id))],
      }
    default:
      return state
  }
}
