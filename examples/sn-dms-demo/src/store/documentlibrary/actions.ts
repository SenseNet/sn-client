import { ODataCollectionResponse, ODataParams, Repository } from '@sensenet/client-core'
import { ValueObserver } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { EventHub } from '@sensenet/repository-events'
import { Action } from 'redux'
import { InjectableAction } from 'redux-di-middleware'
import { changedContent, debounceReloadOnProgress } from '../../Actions'
import { rootStateType } from '../../store/rootReducer'
import { DocumentLibraryState, loadChunkSize } from './reducers'

const eventObservables: Array<ValueObserver<any>> = []

export const startLoadingParent = (idOrPath: number | string) => ({
  type: 'DMS_DOCLIB_LOADING_PARENT',
  idOrPath,
})

export const finishLoadingParent = () => ({
  type: 'DMS_DOCLIB_FINISH_LOADING_PARENT',
})

export const startLoadingChildren = (idOrPath: number | string) => ({
  type: 'DMS_DOCLIB_LOADING_CHILDREN',
  idOrPath,
})

export const finishLoadingChildren = () => ({
  type: 'DMS_DOCLIB_FINISH_LOADING_CHILDREN',
})
export const loadParent: <T extends GenericContent = GenericContent>(
  idOrPath: string | number,
  loadParentOptions?: ODataParams<T>,
) => InjectableAction<rootStateType, Action> = <T extends GenericContent = GenericContent>(
  idOrPath: number | string,
  loadParentOptions?: ODataParams<T>,
) => ({
  type: 'DMS_DOCLIB_LOAD_PARENT',
  inject: async options => {
    const prevState = options.getState().dms.documentLibrary
    if (prevState.parentIdOrPath === idOrPath) {
      return
    }

    eventObservables.forEach(o => o.dispose())
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
        eventHub.onCustomActionExecuted.subscribe(value => {
          const currentItems = options.getState().dms.documentLibrary.items
          if (
            value.actionOptions.name !== 'GetExistingPreviewImages' &&
            (currentItems.d.results.filter(a => a.Id === value.actionOptions.idOrPath) ||
              currentItems.d.results.filter(a => a.Path === value.actionOptions.idOrPath))
          ) {
            emitChange({ ParentId: newParent.d.Id } as GenericContent)
          }
        }) as any,
        eventHub.onContentCreated.subscribe(value => emitChange(value.content)) as any,
        eventHub.onContentModified.subscribe(value => emitChange(value.content)) as any,
        eventHub.onContentDeleted.subscribe(value => {
          const currentItems = options.getState().dms.documentLibrary.items
          const filtered = currentItems.d.results.filter(item => item.Id !== value.contentData.Id)
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
        eventHub.onContentMoved.subscribe(value => emitChange(value.content)) as any,
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
})

export const loadMore: (count?: number) => InjectableAction<rootStateType, Action> = (
  count: number = loadChunkSize,
) => ({
  type: 'DMS_DOCLIB_LOAD_MORE',
  inject: async options => {
    const currentDocLibState = options.getState().dms.documentLibrary

    if (
      (!currentDocLibState.isLoadingChildren && currentDocLibState.items.d.__count === 0) ||
      currentDocLibState.items.d.results.length < currentDocLibState.items.d.__count
    ) {
      const repository = options.getInjectable(Repository)
      const parentIdOrPath = currentDocLibState.parentIdOrPath
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
})

export const setParent: <T extends GenericContent = GenericContent>(content: T) => Action & { content: T } = <T>(
  content: T,
) => ({
  type: 'DMS_DOCLIB_SET_PARENT',
  content,
})

export const setAncestors = <T extends GenericContent>(ancestors: T[]) => ({
  type: 'DMS_DOCLIB_SET_ANCESTORS',
  ancestors,
})

export const setItems: <T extends GenericContent = GenericContent>(
  items: ODataCollectionResponse<T>,
) => Action & { items: ODataCollectionResponse<T> } = <T>(items: ODataCollectionResponse<T>) => ({
  type: 'DMS_DOCLIB_SET_ITEMS',
  items,
})

export const setError = (error?: any) => ({
  type: 'DMS_DOCLIB_SET_ERROR',
  error,
})

export const select = <T extends GenericContent>(selected: T[]) => ({
  type: 'DMS_DOCLIB_SELECT',
  selected,
})

export const setActive = <T extends GenericContent>(active?: T) => ({
  type: 'DMS_DOCLIB_SET_ACTIVE',
  active,
})

export const updateChildrenOptions = <T extends GenericContent>(odataOptions: ODataParams<T>) =>
  ({
    type: 'DMS_DOCLIB_UPDATE_CHILDREN_OPTIONS',
    inject: async options => {
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
        options.dispatch(setChildrenOptions(odataOptions))
      }

      /** */
    },
  } as InjectableAction<rootStateType, Action> & { odataOptions: ODataParams<GenericContent> })

export const updateSearchValues = (value: Partial<DocumentLibraryState['searchState']>) => ({
  type: 'DMS_DOCLIB_UPDATE_SEARCH_STATE',
  value,
})

export const setChildrenOptions = <T extends GenericContent>(odataOptions: ODataParams<T>) => ({
  type: 'DMS_DOCLIB_SET_CHILDREN_OPTIONS',
  odataOptions,
})
