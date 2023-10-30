import { Checkbox, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core'
import { Folder } from '@material-ui/icons'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useCallback } from 'react'
import { GenericContentWithIsParent } from '..'
import { useSelection } from '../hooks'
import { PickerProps } from './picker'

/**
 * Represents a list picker component.
 */
export function SearchPicker<T extends GenericContentWithIsParent = GenericContent>(
  props: PickerProps<T> & { items: T[]; error?: string },
) {
  const { selection, setSelection, allowMultiple } = useSelection()

  const onCheckedChangeHandler = useCallback(
    (_event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.ChangeEvent<HTMLInputElement>, node: T) => {
      const newSelection = allowMultiple ? selection.filter((item) => item.Id !== node.Id) : []
      if (newSelection.length === selection.length || (!allowMultiple && selection[0].Id !== node.Id)) {
        newSelection.push(node)
      }
      setSelection(newSelection)
    },
    [allowMultiple, selection, setSelection],
  )

  const defaultRenderer = useCallback(
    (item: T) => {
      const labelId = `checkbox-list-label-${item.Id}`

      return (
        <ListItem key={item.Id} button={true}>
          <ListItemIcon>
            {!props.selectionBlacklist?.includes(item.Path) && (
              <Checkbox
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

  if (props.error) {
    return (
      props.renderError?.(props.error) || (
        <Typography color="error" variant="caption">
          {props.error}
        </Typography>
      )
    )
  }

  return (
    <List>
      {props.items.map((item) => (
        <div
          onClick={(e) => onCheckedChangeHandler(e, item as any)}
          onDoubleClick={(e) => e.stopPropagation()}
          key={item.Id}>
          {renderItem(item as any)}
        </div>
      ))}
    </List>
  )
}
