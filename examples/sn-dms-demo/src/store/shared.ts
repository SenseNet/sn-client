import { ODataParams, Repository } from '@sensenet/client-core'
import { GenericContent, User } from '@sensenet/default-content-types'
import { Actions, createAction, isFromAction } from '@sensenet/redux'
import { Reducer } from 'redux'
import { IInjectableActionCallbackParams } from 'redux-di-middleware'
import { rootStateType } from './rootReducer'

export const sharedItemsRequested = createAction((user: User) => ({
  type: 'SN_DMS_DEMO_SHARED_WITH_USER_REQUESTED',
  user,
}))

export const sharedItemsReceived = createAction((receivedSharedItems: GenericContent[]) => ({
  type: 'SN_DMS_DEMO_SHARED_WITH_USER_RECEIVED',
  receivedSharedItems,
}))

export const select = createAction(<T extends GenericContent>(selected: T[]) => ({
  type: 'SN_DMS_DEMO_SHARED_WITH_USER_SELECT',
  selected,
}))

export const setActive = createAction(<T extends GenericContent>(active?: T) => ({
  type: 'SN_DMS_DEMO_SHARED_WITH_USER_SET_ACTIVE',
  active,
}))

export const getSharedItems = createAction((user: User) => ({
  type: 'SN_DMS_GET_SHARED_ITEMS',
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    options.dispatch(sharedItemsRequested(user))
    const repo = options.getInjectable(Repository)
    const q = await repo.loadCollection<any>({
      path: '/Root',
      oDataOptions: {
        select: ['DisplayName', 'Description', 'ModificationDate', 'IsFolder', 'ModifiedBy', 'Icon'],
        expand: ['ModifiedBy'],
        query: `InTree:"/Root/Content" +SharedWith:${user.Path}`,
      },
    })
    options.dispatch(sharedItemsReceived(q.d.results))
  },
}))

export interface SharedItemsType {
  user: User
  sharedItems: GenericContent[]
  selected: GenericContent[]
  active?: GenericContent
  childrenOptions: ODataParams<GenericContent>
}

export const shared: Reducer<SharedItemsType> = (
  state = { user: {} as any, sharedItems: [], selected: [], childrenOptions: {} },
  action,
) => {
  if (isFromAction(action, sharedItemsReceived)) {
    return {
      ...state,
      sharedItems: action.receivedSharedItems,
    }
  }
  if (isFromAction(action, sharedItemsRequested)) {
    return {
      ...state,
      user: action.user,
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
      sharedItems: state.sharedItems.map((c: GenericContent) => {
        if (c.Id === (action.result as Actions.PromiseReturns<typeof Actions.updateContent>).d.Id) {
          return action.result.d
        }
        return c
      }),
    }
  }
  /** todo: auto-generated success action from @sn/redux */
  if (action.type === 'DELETE_CONTENT_SUCCESS') {
    const deletedIds = (action.result as Actions.PromiseReturns<typeof Actions.deleteContent>).d.results.map(d => d.Id)
    return {
      ...state,
      sharedItems: [...state.sharedItems.filter((c: GenericContent) => !(deletedIds as any).includes(c.Id))],
    }
  }
  return state
}
