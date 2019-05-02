import { ODataParams, Repository } from '@sensenet/client-core'
import { debounce } from '@sensenet/client-utils'
import { GenericContent, Workspace } from '@sensenet/default-content-types'
import { EventHub } from '@sensenet/repository-events'
import { useEffect, useState } from 'react'
import { useAsync } from 'react-async'
import { loadItems, loadParent } from './loaders'

// tslint:disable-next-line: completed-docs
export const useListPicker = <T extends GenericContent = GenericContent>(
  repository: Repository,
  options: {
    currentPath?: string
    parentId?: number
    itemsOdataOptions?: ODataParams<T>
    parentODataOptions?: ODataParams<T>
    debounceMsOnReload?: number
  } = {},
) => {
  const { currentPath = '', debounceMsOnReload = 1000 } = options || {}
  const [reloadToken, setReloadToken] = useState(0)
  const [selectedItem, setSelectedItem] = useState<T | undefined>()
  const [path, setPath] = useState(currentPath)
  const [parentId, setParentId] = useState<number | undefined>(options.parentId)
  const { data: items } = useAsync({
    promiseFn: loadItems,
    path,
    repository,
    oDataOptions: options.itemsOdataOptions,
    reloadToken,
    watchFn: (current: any, previous: any) => {
      return current.path !== previous.path || current.reloadToken !== previous.reloadToken
    },
  })
  const { data: parent } = useAsync({
    promiseFn: loadParent,
    repository,
    id: parentId,
    oDataOptions: options.parentODataOptions,
    watch: parentId,
  })

  const update = debounce(() => setReloadToken(Math.random()), debounceMsOnReload)
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

  const onItemClickHandler = (event: React.MouseEvent, node: T) => {
    event.preventDefault()
    // Don't pass parent value on selection.
    // Should this be an option to let the user pass that as well?
    if (parent && parent.Id === node.Id) {
      return
    }
    setSelectedItem(node)
  }

  const onItemDoubleClickHandler = (event: React.MouseEvent, node: T) => {
    event.preventDefault()
    setParentIdOnDoubleClick(node)

    // Navigation to parent
    if (parent && node.Id === parentId) {
      setPath(parent.Path)
    } else {
      setPath(node.Path)
    }
  }

  const setParentIdOnDoubleClick = (node: T) => {
    // If parent value is set (there were already some navigation) and clicked, set parent id to parent's parent id
    // otherwise set it to clicked item's parent id.
    if (parent && parent.Id === node.Id) {
      const parentData = parent
      if ((parentData.Workspace as Workspace).Id === parentData.Id) {
        setParentId(undefined)
      } else {
        setParentId(parent.ParentId)
      }
    } else {
      setParentId(node.ParentId)
    }
  }

  const getListItemProps = (props = {}) => ({
    ...props,
    onClick: onItemClickHandler,
    onDoubleClick: onItemDoubleClickHandler,
  })

  return { parent, items, selectedItem, getListItemProps, path }
}
