import { ODataCollectionResponse, ODataParams, Repository } from '@sensenet/client-core'
import { debounce, ValueObserver } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { createAction } from '@sensenet/redux'
import { EventHub } from '@sensenet/repository-events'
import { Dispatch } from 'redux'
import { IInjectableActionCallbackParams } from 'redux-di-middleware'
import { rootStateType } from '../../store/rootReducer'
import { DocumentLibraryState } from './reducers'

const eventObservables: Array<ValueObserver<any>> = []

export const startLoadingParent = createAction((idOrPath: number | string) => ({
  type: 'DMS_DOCLIB_LOADING_PARENT',
  idOrPath,
}))

export const finishLoadingParent = createAction(() => ({
  type: 'DMS_DOCLIB_FINISH_LOADING_PARENT',
}))

export const startLoadingChildren = createAction((idOrPath: number | string) => ({
  type: 'DMS_DOCLIB_LOADING_CHILDREN',
  idOrPath,
}))

export const finishLoadingChildren = createAction(() => ({
  type: 'DMS_DOCLIB_FINISH_LOADING_CHILDREN',
}))

export const setParent = createAction(<T extends GenericContent = GenericContent>(content: T) => ({
  type: 'DMS_DOCLIB_SET_PARENT',
  content,
}))

export const setAncestors = createAction(<T extends GenericContent>(ancestors: T[]) => ({
  type: 'DMS_DOCLIB_SET_ANCESTORS',
  ancestors,
}))

export const updateSearchValues = createAction((value: Partial<DocumentLibraryState['searchState']>) => ({
  type: 'DMS_DOCLIB_UPDATE_SEARCH_STATE',
  value,
}))

export const resetSearchValues = createAction(() => ({
  type: 'DMS_DOCLIB_RESET_SEARCH_STATE',
}))

export const setChildrenOptions = createAction(<T extends GenericContent>(odataOptions: ODataParams<T>) => ({
  type: 'DMS_DOCLIB_SET_CHILDREN_OPTIONS',
  odataOptions,
}))

export const setItems = createAction(
  <T extends GenericContent = GenericContent>(items: ODataCollectionResponse<T>) => ({
    type: 'DMS_DOCLIB_SET_ITEMS',
    items,
  }),
)

export const setError = createAction((error?: any) => ({
  type: 'DMS_DOCLIB_SET_ERROR',
  error,
}))

export const select = createAction(<T extends GenericContent>(selected: T[]) => ({
  type: 'DMS_DOCLIB_SELECT',
  selected,
}))

export const setActive = createAction(<T extends GenericContent>(active?: T) => ({
  type: 'DMS_DOCLIB_SET_ACTIVE',
  active,
}))

export const updateChildrenOptions = createAction(<T extends GenericContent>(odataOptions: ODataParams<T>) => ({
  type: 'DMS_DOCLIB_UPDATE_CHILDREN_OPTIONS',
  odataOptions,
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    const currentState = options.getState()
    const parentPath = currentState.dms.documentLibrary.parent ? currentState.dms.documentLibrary.parent.Path : ''
    const repository = options.getInjectable(Repository)
    options.dispatch(
      startLoadingChildren(
        currentState.dms.documentLibrary.parentIdOrPath ? currentState.dms.documentLibrary.parentIdOrPath : '',
      ),
    )
    try {
      const items = await repository.loadCollection({
        path: parentPath,
        oDataOptions: {
          ...options.getState().dms.documentLibrary.childrenOptions,
          ...odataOptions,
        },
      })
      options.dispatch(setItems(items))
    } catch (error) {
      options.dispatch(setError(error))
    } finally {
      options.dispatch(finishLoadingChildren())
      options.dispatch(setChildrenOptions(odataOptions as ODataParams<GenericContent>))
    }
  },
}))

export const changedContent: GenericContent[] = []

// eslint-disable-next-line require-jsdoc
function methodToDebounce(getState: () => rootStateType, dispatch: Dispatch) {
  const currentContent = getState().dms.documentLibrary.parent
  changedContent.forEach((content) => {
    if (currentContent && currentContent.Id === content.ParentId) {
      dispatch(updateChildrenOptions({}))
      changedContent.length = 0
      return
    }
  })
}
export const debounceReloadOnProgress = debounce(methodToDebounce, 300)

export const loadMore = createAction((count = 25) => ({
  type: 'DMS_DOCLIB_LOAD_MORE',
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    const currentDocLibState = options.getState().dms.documentLibrary

    if (
      (!currentDocLibState.isLoadingChildren && currentDocLibState.items.d.__count === 0) ||
      currentDocLibState.items.d.results.length < currentDocLibState.items.d.__count
    ) {
      const repository = options.getInjectable(Repository)
      const { parentIdOrPath } = currentDocLibState
      options.dispatch(startLoadingChildren(parentIdOrPath ? parentIdOrPath : ''))

      const items = await repository.loadCollection({
        path: currentDocLibState.parent ? currentDocLibState.parent.Path : '',
        oDataOptions: {
          ...currentDocLibState.childrenOptions,
          skip: currentDocLibState.items.d.results.length,
          top: count,
        },
      })

      options.dispatch(
        setItems({
          d: {
            __count: currentDocLibState.items.d.__count,
            results: [...currentDocLibState.items.d.results, ...items.d.results],
          },
        }),
      )
      options.dispatch(finishLoadingChildren())
    }
  },
}))

export const loadParent = createAction(
  <T extends GenericContent = GenericContent>(idOrPath: number | string, loadParentOptions?: ODataParams<T>) => ({
    type: 'DMS_DOCLIB_LOAD_PARENT',
    inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
      const prevState = options.getState().dms.documentLibrary
      if (prevState.parentIdOrPath === idOrPath) {
        return
      }

      eventObservables.forEach((o) => o.dispose())
      eventObservables.length = 0

      const eventHub = options.getInjectable(EventHub)

      options.dispatch(startLoadingParent(idOrPath))
      options.dispatch(startLoadingChildren(idOrPath))
      try {
        const repository = options.getInjectable(Repository)
        const newParent = await repository.load<T>({
          idOrPath,
          oDataOptions: {
            ...prevState.parentOptions,
            ...loadParentOptions,
          },
        })
        options.dispatch(setParent(newParent.d))
        const emitChange = (content: GenericContent) => {
          changedContent.push(content)
          debounceReloadOnProgress(options.getState, options.dispatch)
        }

        eventObservables.push(
          eventHub.onCustomActionExecuted.subscribe((value) => {
            const currentItems = options.getState().dms.documentLibrary.items
            if (
              value.actionOptions.name !== 'GetExistingPreviewImages' &&
              (currentItems.d.results.filter((a) => a.Id === value.actionOptions.idOrPath) ||
                currentItems.d.results.filter((a) => a.Path === value.actionOptions.idOrPath))
            ) {
              emitChange({
                ParentId: newParent.d.Id,
                Id: newParent.d.Id,
                Type: newParent.d.Type,
                Path: newParent.d.Path,
                Name: newParent.d.Name,
              })
            }
          }) as any,
          eventHub.onContentCreated.subscribe((value) => emitChange(value.content)) as any,
          eventHub.onContentModified.subscribe((value) => emitChange(value.content)) as any,
          eventHub.onContentDeleted.subscribe((value) => {
            const currentItems = options.getState().dms.documentLibrary.items
            const filtered = currentItems.d.results.filter((item) => item.Id !== value.contentData.Id)
            options.dispatch(
              setItems({
                ...currentItems,
                d: {
                  __count: filtered.length,
                  results: filtered,
                },
              }),
            )
          }) as any,
          eventHub.onContentMoved.subscribe((value) => emitChange(value.content)) as any,
        )
        const ancestors = await repository.executeAction<undefined, ODataCollectionResponse<GenericContent>>({
          idOrPath: newParent.d.Id,
          method: 'GET',
          name: 'Ancestors',
          body: undefined,
          oDataOptions: {
            ...prevState.childrenOptions,
            orderby: [['Path', 'asc']],
          },
        })
        options.dispatch(setAncestors([...ancestors.d.results, newParent.d]))

        options.dispatch(
          setItems({
            d: {
              __count: 0,
              results: [],
            },
          }),
        )
        options.dispatch(finishLoadingChildren())
        options.dispatch(loadMore())
      } catch (error) {
        options.dispatch(setError(error))
      } finally {
        options.dispatch(finishLoadingParent())
      }
    },
  }),
)
