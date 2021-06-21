import { GenericContent } from '@sensenet/default-content-types'
import { Checkbox, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core'
import { ArrowUpward, Folder } from '@material-ui/icons'
import React, { ChangeEvent, MouseEvent, useCallback } from 'react'
import { useSelection, useTreePicker } from '../../hooks'
import { GenericContentWithIsParent } from '../../types'
import { PickerProps } from '../picker'

/**
 * Represents a list picker component.
 */
export function TreePicker<T extends GenericContentWithIsParent = GenericContent>(props: PickerProps<T>) {
  const { selection, setSelection } = useSelection()
  const { items, navigateTo, isLoading, error } = useTreePicker<T>({
    repository: props.repository,
    currentPath: props.currentPath,
    selectionRoots: props.selectionRoots,
    allowMultiple: props.allowMultiple,
    itemsODataOptions: props.itemsODataOptions as any,
    parentODataOptions: props.parentODataOptions as any,
  })

  const onCheckedChangeHandler = useCallback(
    (_event: ChangeEvent<HTMLInputElement>, node: T) => {
      if (!node.isParent) {
        const newSelection = props.allowMultiple ? selection.filter((item) => item.Id !== node.Id) : []
        if (newSelection.length === selection.length || (!props.allowMultiple && selection[0].Id !== node.Id)) {
          newSelection.push(node)
        }
        setSelection(newSelection)
      }
    },
    [props, selection, setSelection],
  )

  const onDoubleClickHandler = useCallback(
    (_event: MouseEvent, node: T) => {
      if (node.IsFolder || node.isParent) {
        navigateTo(node)
        props.onTreeNavigation?.(node.Path)
      }
    },
    [navigateTo, props],
  )

  const defaultRenderer = useCallback(
    (item: T) => {
      if (item.isParent) {
        return (
          <ListItem data-test="picker-up" key={item.Id} button={true}>
            <ListItemIcon>
              <ArrowUpward />
            </ListItemIcon>
            <ListItemText primary={'[..]'} />
          </ListItem>
        )
      }

      const labelId = `checkbox-list-label-${item.Id}`

      return (
        <ListItem key={item.Id} button={true}>
          <ListItemIcon>
            {!props.selectionBlacklist?.includes(item.Path) && (
              <Checkbox
                data-test={`picker-checkbox-item-${item.Name.replace(/\s+/g, '-').toLowerCase()}`}
                color="primary"
                edge="start"
                checked={selection.some((selected) => selected.Id === item.Id)}
                onChange={(e) => onCheckedChangeHandler(e, item as any)}
                onDoubleClick={(e) => e.stopPropagation()}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            )}
          </ListItemIcon>
          <ListItemIcon>{props.renderIcon?.(item) || <Folder style={{ color: 'primary' }} />}</ListItemIcon>
          <ListItemText
            id={labelId}
            primary={item.DisplayName}
            secondary={item.Path.replace(new RegExp('^/Root', 'g'), '')}
          />
        </ListItem>
      )
    },
    [selection, onCheckedChangeHandler, props],
  )

  const renderItem = props.renderItem || defaultRenderer

  if (isLoading) {
    return props.renderLoading?.() || null
  }

  if (error) {
    return (
      props.renderError?.(error.message) || (
        <Typography color="error" variant="caption">
          {error.message}
        </Typography>
      )
    )
  }

  return (
    <List>
      {items?.map((item) => (
        <div onDoubleClick={(e) => onDoubleClickHandler(e, item as any)} key={item.Id}>
          {renderItem(item as any)}
        </div>
      ))}
    </List>
  )
}
