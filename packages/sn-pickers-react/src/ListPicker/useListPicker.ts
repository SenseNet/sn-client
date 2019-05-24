import { ODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { Reducer, useReducer } from 'react'
import { useAsync } from 'react-async'
import { loadItems } from './loaders'

interface State<T> {
  selectedItem: T | undefined
  path: string
  parentId: number | undefined
}

interface Action {
  type: string
  payload?: any
}

function reducer<T extends GenericContent = GenericContent>(state: State<T>, action: Action) {
  switch (action.type) {
    case useListPicker.types.setSelectedItem: {
      return { ...state, selectedItem: action.payload }
    }
    case useListPicker.types.navigateTo: {
      return { ...state, ...setParentIdAndPath(action.payload.node, action.payload.parent) }
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

/**
 * useListPicker let you select and navigate in the repository with built in defaults
 */
export const useListPicker = <T extends GenericContent = GenericContent>(
  repository: Repository,
  options: {
    currentPath?: string
    itemsODataOptions?: ODataParams<T>
    parentODataOptions?: ODataParams<T>
    stateReducer?: Reducer<State<T>, Action & { changes: State<T> }>
  } = {},
) => {
  // get defaults
  const { stateReducer = (_s: any, a: any) => a.changes, currentPath = '' } = options

  const [{ selectedItem, path, parentId }, dispatch] = useReducer<Reducer<State<T>, Action>>(
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

  const setSelectedItem = (node: T) => dispatch({ type: useListPicker.types.setSelectedItem, payload: node })

  const navigateTo = (node: T) =>
    dispatch({ type: useListPicker.types.navigateTo, payload: { node, parent: items && items.find(c => c.isParent) } })

  return { items, selectedItem, setSelectedItem, navigateTo, path, isLoading, error, reload, dispatch }
}

useListPicker.types = {
  setSelectedItem: 'SET_SELECTED_ITEM',
  navigateTo: 'NAVIGATE_TO',
}
