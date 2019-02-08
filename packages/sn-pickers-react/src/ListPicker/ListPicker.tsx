import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { GenericContent, Workspace } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import React, { useState } from 'react'
import { useAsync } from 'react-use'
import { Item, ItemProps } from './Item'
import { ItemList } from './ItemsList'

/**
 * Properties for list picker component.
 * @interface ListPickerProps
 * @template T
 */
export interface ListPickerProps<T extends { Id: string | number }> {
  loadItems: (path: string) => Promise<Array<Item<T>>>
  loadParent: (id?: number) => Promise<Item<T>>
  onSelectionChanged?: (node: T) => void
  /**
   * Render a loading component when loadItems called.
   * @default null
   * @memberof ListPickerProps
   */
  renderLoading?: () => JSX.Element

  /**
   * Render an error component when error happened in loadItems call.
   * @default null
   * @memberof ListPickerProps
   */
  renderError?: (message: string) => JSX.Element
}

/**
 * Represents a list picker component.
 */
export function ListPickerComponent<T extends GenericContent>(props: ListPickerProps<T>) {
  const [currentPath, setCurrentPath] = useState('')
  const [parentId, setParentId] = useState<number | undefined>(undefined)
  const [selectedId, setSelectedId] = useState<string | number>(0)

  const { loading, value: items, error } = useAsync(() => props.loadItems(currentPath), [currentPath])
  const parent = useAsync(() => props.loadParent(parentId), [parentId])

  const onClickHandler = (event: React.MouseEvent, node: Item<T>) => {
    event.preventDefault()
    props.onSelectionChanged && props.onSelectionChanged(node.nodeData)
    setSelectedId(node.nodeData.Id)
  }

  const onDoubleClickHandler = (event: React.MouseEvent, node: Item<T>) => {
    event.preventDefault()
    setParentIdOnDoubleClick(node.nodeData)

    // Navigation to parent
    if (parent.value && node.nodeData.Id === parentId) {
      setCurrentPath(parent.value.nodeData.Path)
    } else {
      setCurrentPath(node.nodeData.Path)
    }
  }

  const renderItem = (renderItemProps: ItemProps<T>) => (
    <ListItem button={true} selected={renderItemProps.nodeData.Id === selectedId}>
      <ListItemIcon>
        <Icon type={iconType.materialui} iconName="folder" />
      </ListItemIcon>
      <ListItemText primary={renderItemProps.nodeData!.Name} />
    </ListItem>
  )

  if (loading) {
    return props.renderLoading ? props.renderLoading() : null
  }

  if (error) {
    return props.renderError ? props.renderError(error.message) : <div>{error.message}</div>
  }

  return (
    <List>
      <ItemList
        items={items!}
        parentNode={parent.value}
        onNodeClickHandler={onClickHandler}
        onNodeDoubleClickHandler={onDoubleClickHandler}
        renderItem={renderItem}
      />
    </List>
  )

  function setParentIdOnDoubleClick(node: T) {
    // If parent value is set and clicked, set parent id to parent's parent id otherwise set it
    // to clicked item's parent id
    if (parent.value && parent.value.nodeData.Id === node.Id) {
      const parentData = parent.value.nodeData
      if ((parentData.Workspace as Workspace).Id === parentData.Id) {
        setParentId(undefined)
      } else {
        setParentId(parent.value!.nodeData.ParentId)
      }
    } else {
      setParentId(node.ParentId)
    }
  }
}
