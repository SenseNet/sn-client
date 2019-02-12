import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { GenericContent, Workspace } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import React, { useState } from 'react'
import { useAsync } from 'react-use'
import { Item, ItemComponent, ItemProps } from './Item'

/**
 * Properties for list picker component.
 * @interface ListPickerProps
 * @template T
 */
export interface ListPickerProps<T extends { Id: string | number }> {
  loadItems: (path: string) => Promise<Array<Item<T>>>
  loadParent: (id?: number) => Promise<Item<T>>
  currentPath?: string
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

  /**
   * Function to render the item component.
   * @memberof ItemListProps
   * @default const defaultRenderItem = (renderItemProps: ItemProps<T>) => (
   * <ListItem button={true} selected={renderItemProps.nodeData.Id === selectedId}>
   *   <ListItemIcon>
   *     <Icon type={iconType.materialui} iconName="folder" />
   *   </ListItemIcon>
   *   <ListItemText primary={renderItemProps.nodeData!.Name} />
   * </ListItem>
   * )
   */
  renderItem?: (props: ItemProps<T>) => JSX.Element
}

/**
 * Represents a list picker component.
 */
export function ListPickerComponent<T extends GenericContent = GenericContent>(props: ListPickerProps<T>) {
  const [currentPath, setCurrentPath] = useState(props.currentPath || '')
  const [parentId, setParentId] = useState<number | undefined>(undefined)
  const [selectedId, setSelectedId] = useState<string | number>(0)

  const { loading, value: items, error } = useAsync(() => props.loadItems(currentPath), [currentPath])
  const parent = useAsync(() => props.loadParent(parentId), [parentId])

  const onItemClickHandler = (event: React.MouseEvent, node: Item<T>) => {
    event.preventDefault()
    props.onSelectionChanged && props.onSelectionChanged(node.nodeData)
    setSelectedId(node.nodeData.Id)
  }

  const onItemDoubleClickHandler = (event: React.MouseEvent, node: Item<T>) => {
    event.preventDefault()
    setParentIdOnDoubleClick(node.nodeData)

    // Navigation to parent
    if (parent.value && node.nodeData.Id === parentId) {
      setCurrentPath(parent.value.nodeData.Path)
    } else {
      setCurrentPath(node.nodeData.Path)
    }
  }

  const defaultRenderItem = (renderItemProps: ItemProps<T>) => (
    <ListItem button={true} selected={renderItemProps.nodeData.Id === selectedId}>
      <ListItemIcon>
        <Icon type={iconType.materialui} iconName="folder" />
      </ListItemIcon>
      <ListItemText primary={renderItemProps.nodeData!.Name} />
    </ListItem>
  )

  const renderItem = props.renderItem || defaultRenderItem

  if (loading) {
    return props.renderLoading ? props.renderLoading() : null
  }

  if (error) {
    return props.renderError ? props.renderError(error.message) : null
  }

  return (
    <List>
      {parent.value !== undefined ? (
        <ItemComponent
          onClickHandler={onItemClickHandler}
          onDoubleClickHandler={onItemDoubleClickHandler}
          nodeData={{ Name: '..', DisplayName: '..' } as any}
          renderItem={renderItem}
        />
      ) : null}
      {items &&
        items.map(item => (
          <ItemComponent
            key={item.nodeData.Id}
            nodeData={item.nodeData}
            onClickHandler={onItemClickHandler}
            onDoubleClickHandler={onItemDoubleClickHandler}
            renderItem={renderItem}
          />
        ))}
    </List>
  )

  function setParentIdOnDoubleClick(node: T) {
    // If parent value is set (there were already some navigation) and clicked, set parent id to parent's parent id
    // otherwise set it to clicked item's parent id.
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
