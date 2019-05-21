import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import React from 'react'
import { useListPicker } from '.'
import { ListPickerProps } from './ListPickerProps'
import { GenericContentWithIsParent } from './loaders'

/**
 * Represents a list picker component.
 */
export function ListPickerComponent<T extends GenericContentWithIsParent = GenericContent>(props: ListPickerProps<T>) {
  const { items, selectedItem, setSelectedItem, navigateTo, isLoading, error } = useListPicker<
    GenericContentWithIsParent
  >(props.repository, {
    currentPath: props.currentPath,
    itemsOdataOptions: props.itemsOdataOptions as any,
    parentODataOptions: props.parentODataOptions as any,
    debounceMsOnReload: props.debounceMsOnReload,
  })

  if (isLoading) {
    return props.renderLoading ? props.renderLoading() : null
  }

  if (error) {
    return props.renderError ? props.renderError(error.message) : null
  }

  const onClickHandler = (_event: React.MouseEvent, node: T) => {
    setSelectedItem(node)
    props.onSelectionChanged && props.onSelectionChanged(node)
  }

  const onDoubleClickHandler = (_event: React.MouseEvent, node: T) => {
    navigateTo(node)
    props.onNavigation && props.onNavigation(node.Path)
  }

  const defaultRenderer = (item: T) => {
    return (
      <ListItem key={item.Id} button={true} selected={selectedItem && item.Id === selectedItem.Id}>
        <ListItemIcon>
          <Icon type={iconType.materialui} iconName="folder" style={{ color: item.isParent ? 'yellow' : 'primary' }} />
        </ListItemIcon>
        <ListItemText primary={item.DisplayName} />
      </ListItem>
    )
  }

  const renderItem = props.renderItem || defaultRenderer

  return (
    <List>
      {items &&
        items.map(item => (
          <div
            onClick={e => onClickHandler(e, item as any)}
            onDoubleClick={e => onDoubleClickHandler(e, item as any)}
            key={item.Id}>
            {renderItem(item as any)}
          </div>
        ))}
    </List>
  )
}
