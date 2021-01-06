import { GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import Checkbox from '@material-ui/core/Checkbox'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import React, { useCallback } from 'react'
import { GenericContentWithIsParent } from '..'
import { useSelection } from '../hooks/useSelection'
import { PickerProps } from './Picker'

/**
 * Represents a list picker component.
 */
export function SearchPicker<T extends GenericContentWithIsParent = GenericContent>(
  props: PickerProps<T> & { items: T[] },
) {
  const { selection, setSelection, allowMultiple } = useSelection()

  const onCheckedChangeHandler = useCallback(
    (_event: React.ChangeEvent<HTMLInputElement>, node: T) => {
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

  // if (error) {
  //   return props.renderError ? props.renderError(error.message) : null
  // }

  return <List>{props.items.map((item) => renderItem(item as any))}</List>
}
