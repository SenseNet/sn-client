import { GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import Checkbox from '@material-ui/core/Checkbox'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import React, { useCallback } from 'react'
import { useListPicker, useSelection } from '../../hooks'
import { GenericContentWithIsParent } from '../../types'
import { PickerProps } from '../Picker'

/**
 * Represents a list picker component.
 */
export function ListPicker<T extends GenericContentWithIsParent = GenericContent>(props: PickerProps<T>) {
  const { selection, setSelection } = useSelection()
  const { items, navigateTo, isLoading, error } = useListPicker<T>({
    repository: props.repository,
    currentPath: props.currentPath,
    selectionRoots: props.selectionRoots,
    allowMultiple: props.allowMultiple,
    itemsODataOptions: props.itemsODataOptions as any,
    parentODataOptions: props.parentODataOptions as any,
  })

  const onCheckedChangeHandler = useCallback(
    (_event: React.ChangeEvent<HTMLInputElement>, node: T) => {
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
    (_event: React.MouseEvent, node: T) => {
      if (node.IsFolder) {
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
          <ListItem key={item.Id} button={true}>
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
          <ListItemIcon>
            {props.renderIcon?.(item) || (
              <Icon type={iconType.materialui} iconName="folder" style={{ color: 'primary' }} />
            )}
          </ListItemIcon>
          <ListItemText
            id={labelId}
            primary={item.DisplayName}
            secondary={
              props.selectionRoots ? item.Path.replace(new RegExp(`^${props.selectionRoots}`, 'g'), '') : item.Path
            }
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
