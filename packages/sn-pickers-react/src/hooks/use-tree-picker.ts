import { ODataParams, Repository } from '@sensenet/client-core'
import { AsyncReturnValue, PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadItems } from '../components/tree-picker/loaders'
import { GenericContentWithIsParent } from '../types'

interface State {
  path: string
  parentId: number | undefined
}

const setParentIdAndPath = <T extends GenericContent>(node: T, parent?: T) => {
  return parent && parent.Id === node.Id
    ? { parentId: parent.ParentId, path: parent.Path }
    : { parentId: node.ParentId, path: node.Path }
}

/**
 * useTreePicker let you select and navigate in the repository with built in defaults
 */
export const useTreePicker = <T extends GenericContentWithIsParent = GenericContent>(options: {
  repository: Repository
  currentPath?: string
  selectionRoots?: string[]
  allowMultiple?: boolean
  itemsODataOptions?: ODataParams<T>
  parentODataOptions?: ODataParams<T>
  navigationPath?: string
}) => {
  // get defaults
  const { repository, currentPath = '', navigationPath } = options

  const roots = useMemo(
    () =>
      options.selectionRoots?.filter(
        (root, _index, original) => !original.some((item) => PathHelper.isAncestorOf(item, root)),
      ),
    [options.selectionRoots],
  )

  const [{ path, parentId }, dispatch] = useState<State>({
    path: currentPath,
    parentId: undefined,
  })

  const [reloadToken, setReloadToken] = useState(0)
  const [items, setItems] = useState<AsyncReturnValue<typeof loadItems>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()
  const reload = useCallback(() => {
    setReloadToken(Date.now())
  }, [])

  useEffect(() => {
    const abortController = new AbortController()
    ;(async () => {
      try {
        setIsLoading(true)

        const result = await loadItems({
          path: navigationPath || path,
          loadParent: !roots?.includes(navigationPath || path),
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
  }, [
    repository,
    reloadToken,
    parentId,
    roots,
    options.itemsODataOptions,
    options.parentODataOptions,
    path,
    navigationPath,
  ])

  const navigateTo = useCallback(
    (node: T) => dispatch(setParentIdAndPath(node, items?.find((c) => c.isParent) as T)),
    [items],
  )

  return { items, navigateTo, path, isLoading, error, reload }
}
