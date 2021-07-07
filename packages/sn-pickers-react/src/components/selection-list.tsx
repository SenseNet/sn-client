import { GenericContent } from '@sensenet/default-content-types'
import { Checkbox, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { Folder } from '@material-ui/icons'
import React, { useCallback } from 'react'
import { GenericContentWithIsParent } from '..'
import { useSelection } from '../hooks/use-selection'
import { PickerProps } from './picker'

/**
 * Represents a selection list component.
 */
export function SelectionList<T extends GenericContentWithIsParent = GenericContent>(props: PickerProps<T>) {
  const { selection, setSelection } = useSelection()

  const onCheckedChangeHandler = useCallback(
    (_event: React.ChangeEvent<HTMLInputElement>, node: T) => {
      setSelection(selection.filter((item) => item.Id !== node.Id))
    },
    [selection, setSelection],
  )

  const defaultRenderer = useCallback(
    (item: T) => {
      const labelId = `checkbox-list-label-${item.Id}`

      return (
        <ListItem key={item.Id} button={true}>
          <ListItemIcon>
            <Checkbox
              color="primary"
              edge="start"
              checked={true}
              onChange={(e) => onCheckedChangeHandler(e, item as any)}
              tabIndex={-1}
              disableRipple
              inputProps={{ 'aria-labelledby': labelId }}
            />
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
    [onCheckedChangeHandler, props],
  )

  const renderItem = props.renderItem || defaultRenderer

  return <List>{selection.map((item) => renderItem(item as any))}</List>
}
