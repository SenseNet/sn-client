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

  const onClickHandler = (node: Item<T>, event: React.MouseEvent) => {
    event.preventDefault()
    setSelectedId(node.nodeData.Id)
  }

  const onDoubleClickHandler = (node: Item<T>, event: React.MouseEvent) => {
    event.preventDefault()
    if (parent.value && parent.value.nodeData.Id === node.nodeData.Id) {
      const parentData = parent.value.nodeData
      if ((parentData.Workspace as Workspace).Id === parentData.Id) {
        setParentId(undefined)
      } else {
        setParentId(parent.value!.nodeData.ParentId)
      }
    } else {
      setParentId(node.nodeData.ParentId)
    }
    // User clicked parent
    if (parent.value && node.nodeData.Id === parentId) {
      setCurrentPath(parent.value.nodeData.Path)
    } else {
      setCurrentPath(node.nodeData.Path)
    }
  }

  // const getSelectedItem = () => {
  //   const selectedItem = items.find(item => item.id === selectedId)
  //   return selectedItem ? selectedItem.name : 'Not found'
  // }

  const renderItem = (renderItemProps: ItemProps<T>) => (
    <ListItem button={true} selected={renderItemProps.nodeData.Id === selectedId}>
      <ListItemIcon>
        <Icon type={iconType.materialui} iconName="folder" />
      </ListItemIcon>
      <ListItemText primary={renderItemProps.nodeData!.Name} />
    </ListItem>
  )

  return (
    <List>
      {loading ? null : error ? (
        <div>{error.message}</div>
      ) : (
        <>
          <ItemList
            items={items!}
            parentNode={parent.value}
            onNodeClickHandler={onClickHandler}
            onNodeDoubleClickHandler={onDoubleClickHandler}
            renderItem={renderItem}
          />
        </>
      )}
    </List>
  )
}
