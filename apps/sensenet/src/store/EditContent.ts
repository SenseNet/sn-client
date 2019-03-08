import { ODataCollectionResponse, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { AnyAction, Reducer } from 'redux'
import { IInjectableActionCallbackParams } from 'redux-di-middleware'
import Semaphore from 'semaphore-async-await'
import { rootStateType } from '.'
import { createAction, isFromAction } from './ActionHelpers'

export interface EditContentState<T extends GenericContent> {
  currentContent: T
  ancestors: GenericContent[]
  error?: any
}

const loadLock = new Semaphore(1)

export const loadContent = createAction((id: number, repo: Repository) => ({
  type: 'LOAD_CONTENT_TO_EDIT',
  id,
  // tslint:disable-next-line: no-unnecessary-type-annotation
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    try {
      await loadLock.acquire()
      if (id === options.getState().editContent.currentContent.Id) {
        return
      }
      const response = await repo.load({
        idOrPath: id,
        oDataOptions: {
          select: 'all',
        },
      })

      // Fallback for invalid Ancestor requests (e.g. for ContentTypes)
      let ancestorsResponse: ODataCollectionResponse<GenericContent> = { d: { results: [], __count: 0 } }
      try {
        ancestorsResponse = await repo.executeAction<undefined, ODataCollectionResponse<GenericContent>>({
          idOrPath: id,
          method: 'GET',
          name: 'Ancestors',
          body: undefined,
          oDataOptions: {
            select: 'all',
            orderby: [['Path', 'asc']],
          },
        })
      } catch {
        /** */
      }
      options.dispatch(setContext(response.d, ancestorsResponse.d.results))
    } catch (error) {
      options.dispatch(setError(error))
    } finally {
      loadLock.release()
    }
  },
}))

export const setContext = createAction((content: GenericContent, ancestors: GenericContent[]) => ({
  type: 'SET_EDITED_CONTENT',
  content,
  ancestors,
}))

export const setError = createAction(error => ({
  type: 'SET_EDIT_ERROR',
  error,
}))

export const editContent: Reducer<EditContentState<GenericContent>, AnyAction> = (
  state = { currentContent: { Id: 0 } as any, ancestors: [] },
  action,
) => {
  if (isFromAction(action, setContext)) {
    return {
      ...state,
      currentContent: action.content,
      ancestors: action.ancestors,
      error: undefined,
    }
  }
  if (isFromAction(action, setError)) {
    return {
      ...state,
      error: action.error,
    }
  }
  return state
}
