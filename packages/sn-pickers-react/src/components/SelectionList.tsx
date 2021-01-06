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
              edge="start"
              checked={true}
              onChange={(e) => onCheckedChangeHandler(e, item as any)}
              tabIndex={-1}
              disableRipple
              inputProps={{ 'aria-labelledby': labelId }}
            />
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
    [onCheckedChangeHandler, props],
  )

  const renderItem = props.renderItem || defaultRenderer

  return <List>{selection.map((item) => renderItem(item as any))}</List>
}
