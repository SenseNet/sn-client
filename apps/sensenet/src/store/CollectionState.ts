import { ODataCollectionResponse, ODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { AnyAction } from 'redux'
import { IInjectableActionCallbackParams } from 'redux-di-middleware'
import Semaphore from 'semaphore-async-await'
import { createAction, isFromAction } from './ActionHelpers'

export interface CollectionStateOptions<TStoreType> {
  prefix: string
  defaultParent?: GenericContent
  defaultChildren?: GenericContent[]
  defaultAncestors?: GenericContent[]
  parentLoadOptions?: ODataParams<GenericContent>
  childrenLoadOptions?: ODataParams<GenericContent>
  ancestorsLoadOptions?: ODataParams<GenericContent>
  getSelfState: (state: TStoreType) => CollectionStateType
}

export interface CollectionStateType {
  isInitialized: boolean
  selected: GenericContent[]
  parent: GenericContent
  activeContent: GenericContent
  children: GenericContent[]
  ancestors: GenericContent[]
}

export const createCollectionState = <TStateType>(collectionOptions: CollectionStateOptions<TStateType>) => {
  const parentLoadOptions = collectionOptions.parentLoadOptions || {}
  const childrenLoadOptions = collectionOptions.childrenLoadOptions || {
    orderby: [['IsFolder', 'desc']],
    select: 'all',
    expand: 'CreatedBy',
  }
  const ancestorsLoadOptions = collectionOptions.ancestorsLoadOptions || {
    orderby: [['Path', 'asc']],
  }

  const loadLock = new Semaphore(1)
  const loadParent = createAction((id: number, forceUpdate?: boolean) => ({
    type: `${collectionOptions.prefix}_SET_PARENT`,
    // tslint:disable-next-line: no-unnecessary-type-annotation
    inject: async (options: IInjectableActionCallbackParams<TStateType>) => {
      try {
        await loadLock.acquire()
        const repo = options.getInjectable(Repository)
        const currentState = collectionOptions.getSelfState(options.getState())
        if (!forceUpdate && currentState.parent.Id === id) {
          return
        }

        let parent!: GenericContent
        const fromAncestors = currentState.ancestors.find(a => a.Id === id)
        if (fromAncestors) {
          parent = fromAncestors
        } else {
          const fromChildren = currentState.children.find(a => a.Id === id)
          if (!fromChildren) {
            const parentResponse = await repo.load({
              idOrPath: id,
              oDataOptions: parentLoadOptions,
            })
            parent = parentResponse.d
          } else {
            parent = fromChildren
          }
        }

        const childrenPromise = repo.loadCollection({
          path: parent.Path,
          oDataOptions: { ...childrenLoadOptions },
        })

        let ancestorsPromise!: Promise<ODataCollectionResponse<GenericContent>>

        if (fromAncestors) {
          let ancestors!: GenericContent[]
          const lastParent = currentState.parent
          const ancestorIndex = currentState.ancestors.findIndex(a => a.Id === parent.Id)
          if (ancestorIndex !== -1) {
            ancestors = currentState.ancestors.slice(0, ancestorIndex)
          } else if (!ancestors.length && lastParent && !lastParent.ParentId) {
            ancestors = [lastParent]
          }
          ancestorsPromise = Promise.resolve<ODataCollectionResponse<GenericContent>>({
            d: {
              __count: ancestors.length,
              results: [...ancestors],
            },
          })
        } else {
          ancestorsPromise = repo.executeAction<undefined, ODataCollectionResponse<GenericContent>>({
            idOrPath: parent.Path,
            method: 'GET',
            name: 'Ancestors',
            body: undefined,
            oDataOptions: ancestorsLoadOptions,
          })
        }

        const [childrenResponse, ancestorsResponse] = await Promise.all([childrenPromise, ancestorsPromise])
        options.dispatch(setContext(parent, childrenResponse.d.results, ancestorsResponse.d.results))
      } finally {
        loadLock.release()
      }
    },
  }))

  const setContext = createAction(
    (parent: GenericContent, children: GenericContent[], ancestors: GenericContent[]) => ({
      type: `${collectionOptions.prefix}_SET_CONTEXT`,
      parent,
      children,
      ancestors,
    }),
  )

  const select = createAction((selection: GenericContent[]) => ({
    type: `${collectionOptions.prefix}_SELECT`,
    selection,
  }))

  const setActive = createAction((content: GenericContent) => ({
    type: `${collectionOptions.prefix}_SET_ACTIVE`,
    content,
  }))

  const defaultCollectionState: CollectionStateType = {
    isInitialized: false,
    parent: {} as any,
    children: [],
    ancestors: [],
    selected: [],
    activeContent: {} as any,
  }

  const reducer = (state: CollectionStateType = defaultCollectionState, action: AnyAction) => {
    if (isFromAction(action, setContext)) {
      return {
        ...state,
        isInitialized: true,
        parent: action.parent,
        children: action.children,
        ancestors: action.ancestors,
        activeContent: action.children[0],
      }
    }
    if (isFromAction(action, select)) {
      return {
        ...state,
        selected: action.selection,
      }
    }
    if (isFromAction(action, setActive) && state.activeContent.Id !== action.content.Id) {
      return {
        ...state,
        activeContent: action.content,
      }
    }
    return state
  }

  return {
    loadParent,
    select,
    setContext,
    setActive,
    reducer,
    collectionOptions,
  }
}
