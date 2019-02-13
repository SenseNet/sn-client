import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { GenericContent, Workspace } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import React, { useState } from 'react'
import { useAsync } from 'react-use'
import { ItemComponent } from './Item'
import { ListPickerProps } from './ListPickerProps'

/**
 * Represents a list picker component.
 */
export function ListPickerComponent<T extends GenericContent = GenericContent>(props: ListPickerProps<T>) {
  const { currentPath: currentContentPath = '' } = props
  const [currentPath, setCurrentPath] = useState(currentContentPath)
  const [parentId, setParentId] = useState<number | undefined>(props.parentId)
  const [selectedId, setSelectedId] = useState<string | number>(0)

  const { loading, value: items, error } = useAsync(() => props.loadItems(currentPath), [currentPath])
  const parent = useAsync(() => props.loadParent(parentId), [parentId])

  const onItemClickHandler = (event: React.MouseEvent, node: T) => {
    event.preventDefault()
    // Don't pass parent value on selection.
    // Should this be an option to let the user pass that as well?
    if (parent.value && parent.value.Id === node.Id) {
      return
    }
    props.onSelectionChanged && props.onSelectionChanged(node)
    setSelectedId(node.Id)
  }

  const onItemDoubleClickHandler = (event: React.MouseEvent, node: T) => {
    event.preventDefault()
    props.onNavigation && props.onNavigation()
    setParentIdOnDoubleClick(node)

    // Navigation to parent
    if (parent.value && node.Id === parentId) {
      setCurrentPath(parent.value.Path)
    } else {
      setCurrentPath(node.Path)
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
          node={{ ...parent.value, DisplayName: '..' }}
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

  function setParentIdOnDoubleClick(node: T) {
    // If parent value is set (there were already some navigation) and clicked, set parent id to parent's parent id
    // otherwise set it to clicked item's parent id.
    if (parent.value && parent.value.Id === node.Id) {
      const parentData = parent.value
      if ((parentData.Workspace as Workspace).Id === parentData.Id) {
        setParentId(undefined)
      } else {
        setParentId(parent.value.ParentId)
      }
    } else {
      setParentId(node.ParentId)
    }
  }
}
