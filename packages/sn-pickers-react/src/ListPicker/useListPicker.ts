import { ODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { Reducer, useReducer } from 'react'
import { useAsync } from 'react-async'
import { loadItems } from './loaders'
import { Action, GenericContentWithIsParent, NAVIGATE_TO, SET_SELECTED_ITEM, State } from './types'

function reducer<T extends GenericContent>(state: State<T>, action: Action<T>) {
  switch (action.type) {
    case SET_SELECTED_ITEM: {
      return { ...state, selectedItem: action.payload }
    }
    case NAVIGATE_TO: {
      return { ...state, ...setParentIdAndPath(action.payload.node, action.payload.parent) }
    }
  }
}

const setParentIdAndPath = <T extends GenericContent>(node: T, parent?: T) => {
  return parent && parent.Id === node.Id
    ? { parentId: parent.ParentId, path: parent.Path }
    : { parentId: node.ParentId, path: node.Path }
}

/**
 * useListPicker let you select and navigate in the repository with built in defaults
 */
export const useListPicker = <T extends GenericContentWithIsParent = GenericContent>(options: {
  repository: Repository
  currentPath?: string
  itemsODataOptions?: ODataParams<T>
  parentODataOptions?: ODataParams<T>
  stateReducer?: Reducer<State<T>, Action<T> & { changes: State<T> }>
}) => {
  // get defaults
  const { repository, stateReducer = (_s: any, a: any) => a.changes, currentPath = '' } = options

  const [{ selectedItem, path, parentId }, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(
    (state, action) => {
      const changes = reducer(state, action)
      return stateReducer(state, { ...action, changes })
    },
    {
      path: currentPath,
      selectedItem: undefined,
      parentId: undefined,
    },
  )

  const { data: items, isLoading, error, reload } = useAsync({
    promiseFn: loadItems,
    path,
    repository,
    itemsODataOptions: options.itemsODataOptions,
    parentODataOptions: options.parentODataOptions,
    parentId,
    watch: path,
  })

  const setSelectedItem = (node: T) => dispatch({ type: SET_SELECTED_ITEM, payload: node })

  const navigateTo = (node: T) =>
    dispatch({ type: NAVIGATE_TO, payload: { node, parent: items && (items.find(c => c.isParent) as any) } })

  return { items, selectedItem, setSelectedItem, navigateTo, path, isLoading, error, reload, dispatch }
}
