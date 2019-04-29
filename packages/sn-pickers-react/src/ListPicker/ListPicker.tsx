import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { debounce } from '@sensenet/client-utils'
import { GenericContent, Workspace } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import { EventHub } from '@sensenet/repository-events'
import React, { useEffect, useState } from 'react'
import { useAsync } from 'react-async'
import { ItemComponent } from './Item'
import { ListPickerProps } from './ListPickerProps'
import { loadItems, loadParent } from './loaders'

/**
 * Represents a list picker component.
 */
export function ListPickerComponent<T extends GenericContent = GenericContent>(props: ListPickerProps<T>) {
  const { currentPath = '', debounceMsOnReload = 1000 } = props
  const [parentId, setParentId] = useState<number | undefined>(props.parentId)
  const [selectedId, setSelectedId] = useState<string | number>(0)
  const [reloadToken, setReloadToken] = useState(0)
  const { data: items, error: itemsError, isLoading: areItemsLoading } = useAsync({
    promiseFn: loadItems,
    path: currentPath,
    repository: props.repository,
    oDataOptions: props.itemsOdataOptions,
    reloadToken,
    watchFn: (current: any, previous: any) => {
      return current.path !== previous.path || current.reloadToken !== previous.reloadToken
    },
  })
  const { data: parent, error: parentError, isLoading: isParentLoading } = useAsync({
    promiseFn: loadParent,
    repository: props.repository,
    id: parentId,
    oDataOptions: props.parentODataOptions,
    watch: parentId,
  })

  const update = debounce(() => setReloadToken(Math.random()), debounceMsOnReload)
  useEffect(() => {
    const eventHub = new EventHub(props.repository)
    const subscriptions = [
      eventHub.onContentCreated.subscribe(update),
      eventHub.onContentCopied.subscribe(update),
      eventHub.onContentMoved.subscribe(update),
      eventHub.onContentModified.subscribe(update),
      eventHub.onContentDeleted.subscribe(update),
      eventHub.onUploadFinished.subscribe(update),
    ]
    return () => [...subscriptions, eventHub].forEach(s => s.dispose())
  }, [props.repository])

  const onItemClickHandler = (event: React.MouseEvent, node: T) => {
    event.preventDefault()
    // Don't pass parent value on selection.
    // Should this be an option to let the user pass that as well?
    if (parent && parent.Id === node.Id) {
      return
    }
    props.onSelectionChanged && props.onSelectionChanged(node)
    setSelectedId(node.Id)
  }

  const onItemDoubleClickHandler = (event: React.MouseEvent, node: T) => {
    event.preventDefault()
    setParentIdOnDoubleClick(node)

    // Navigation to parent
    if (parent && node.Id === parentId) {
      props.onNavigation && props.onNavigation(parent.Path)
    } else {
      props.onNavigation && props.onNavigation(node.Path)
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

  const defaultRenderItem = (node: T) => (
    <ListItem button={true} selected={node.Id === selectedId}>
      <ListItemIcon>
        <Icon type={iconType.materialui} iconName="folder" />
      </ListItemIcon>
      <ListItemText primary={node.DisplayName} />
    </ListItem>
  )

  const renderItem = props.renderItem || defaultRenderItem

  if (areItemsLoading || isParentLoading) {
    return props.renderLoading ? props.renderLoading() : null
  }

  if (itemsError || parentError) {
    const errorMessage = (itemsError && itemsError.message) || (parentError && parentError.message)
    return props.renderError ? props.renderError(errorMessage!) : null
  }

  return (
    <List>
      {parent !== undefined ? (
        <ItemComponent
          node={{ ...parent, DisplayName: '..' } as T}
          onClickHandler={onItemClickHandler}
          onDoubleClickHandler={onItemDoubleClickHandler}
          renderItem={renderItem}
        />
      ) : null}
      {items &&
        items.map(item => (
          <ItemComponent
            key={item.Id}
            node={item}
            onClickHandler={onItemClickHandler}
            onDoubleClickHandler={onItemDoubleClickHandler}
            renderItem={renderItem}
          />
        ))}
    </List>
  )
}
