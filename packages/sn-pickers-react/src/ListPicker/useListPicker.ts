import { ODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { Reducer, useCallback, useEffect, useReducer, useState } from 'react'
import { AsyncReturnValue } from '@sensenet/client-utils'
import { loadItems } from './loaders'
import { Action, GenericContentWithIsParent, NAVIGATE_TO, SET_SELECTED_ITEM, State } from './types'

const setParentIdAndPath = <T extends GenericContent>(node: T, parent?: T) => {
  return parent && parent.Id === node.Id
    ? { parentId: parent.ParentId, path: parent.Path }
    : { parentId: node.ParentId, path: node.Path }
}

/**
 * Reducer to modify the state of the list picker
 * @template T
 * @param {State<T>} state
 * @param {Action<T>} action
 * @returns a new state
 */
function reducer<T extends GenericContent>(state: State<T>, action: Action<T>) {
  switch (action.type) {
    case SET_SELECTED_ITEM: {
      return { ...state, selectedItem: action.payload }
    }
    case NAVIGATE_TO: {
      return { ...state, ...setParentIdAndPath(action.payload.node, action.payload.parent) }
    }
    // no default
  }
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

  const [reloadToken, setReloadToken] = useState(0)
  const [items, setItems] = useState<AsyncReturnValue<typeof loadItems>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()
  const reload = useCallback(() => {
    setReloadToken(Math.random())
  }, [])

  useEffect(() => {
    const abortController = new AbortController()
    ;(async () => {
      try {
        setIsLoading(true)
        const result = await loadItems({
          path,
          repository,
          parentId,
          itemsODataOptions: options.itemsODataOptions,
          parentODataOptions: options.parentODataOptions,
          abortController,
        })
        setItems(result)
      } catch (e) {
        if (!abortController.signal.aborted) {
          setError(e)
        }
      } finally {
        setIsLoading(false)
      }
    })()
  }, [options.itemsODataOptions, options.parentODataOptions, path, repository, reloadToken, parentId])

  const setSelectedItem = (node?: T) => dispatch({ type: SET_SELECTED_ITEM, payload: node })

  const navigateTo = (node: T) =>
    dispatch({ type: NAVIGATE_TO, payload: { node, parent: items && (items.find(c => c.isParent) as any) } })

  return { items, selectedItem, setSelectedItem, navigateTo, path, isLoading, error, reload }
}
