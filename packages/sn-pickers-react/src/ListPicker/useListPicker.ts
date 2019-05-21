import { ODataParams, Repository } from '@sensenet/client-core'
import { debounce } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { EventHub } from '@sensenet/repository-events'
import { Reducer, useEffect, useReducer } from 'react'
import { useAsync } from 'react-async'
import { loadItems } from './loaders'

interface State<T> {
  selectedItem: T | undefined
  path: string
  parentId: number | undefined
}

const actions = {
  setSelectedItem: 'SET_SELECTED_ITEM',
  navigateTo: 'NAVIGATE_TO',
  setReloadToken: 'SET_RELOAD_TOKEN',
}

function reducer<T extends GenericContent = GenericContent>(state: State<T>, action: any) {
  switch (action.type) {
    case actions.setSelectedItem: {
      return { ...state, selectedItem: action.payload }
    }
    case actions.navigateTo: {
      return { ...state, ...setParentIdAndPath(action.payload.node, action.payload.parent) }
    }
    case actions.setReloadToken: {
      return { ...state, reloadToken: Math.random() }
    }
    default: {
      throw new Error(`Unhandled type: ${action.type}`)
    }
  }
}

const setParentIdAndPath = <T extends GenericContent = GenericContent>(node: T, parent?: T) => {
  return parent && parent.Id === node.Id
    ? { parentId: parent.ParentId, path: parent.Path }
    : { parentId: node.ParentId, path: node.Path }
}

// tslint:disable-next-line: completed-docs
export const useListPicker = <T extends GenericContent = GenericContent>(
  repository: Repository,
  options: {
    currentPath?: string
    itemsOdataOptions?: ODataParams<T>
    parentODataOptions?: ODataParams<T>
    debounceMsOnReload?: number
  } = {},
) => {
  const { debounceMsOnReload = 1000 } = options || {}
  const [{ selectedItem, path, parentId }, dispatch] = useReducer<Reducer<State<T>, { type: string; payload?: any }>>(
    reducer,
    { path: options.currentPath || '', selectedItem: undefined, parentId: undefined },
  )
  const { data: items, isLoading, error, reload } = useAsync({
    promiseFn: loadItems,
    path,
    repository,
    oDataOptions: options.itemsOdataOptions,
    parentODataOptions: options.parentODataOptions,
    parentId,
    watch: path,
  })

  // const update = debounce(() => dispatch({ type: actions.setReloadToken }), debounceMsOnReload)
  const update = debounce(reload, debounceMsOnReload)
  useEffect(() => {
    const eventHub = new EventHub(repository)
    const subscriptions = [
      eventHub.onContentCreated.subscribe(update),
      eventHub.onContentCopied.subscribe(update),
      eventHub.onContentMoved.subscribe(update),
      eventHub.onContentModified.subscribe(update),
      eventHub.onContentDeleted.subscribe(update),
      eventHub.onUploadFinished.subscribe(update),
    ]
    return () => [...subscriptions, eventHub].forEach(s => s.dispose())
  }, [repository])

  const setSelectedItem = (node: T) => dispatch({ type: actions.setSelectedItem, payload: node })

  const navigateTo = (node: T) =>
    dispatch({ type: actions.navigateTo, payload: { node, parent: items && items.find(c => c.isParent) } })

  return { items, selectedItem, setSelectedItem, navigateTo, path, isLoading, error, reload }
}
