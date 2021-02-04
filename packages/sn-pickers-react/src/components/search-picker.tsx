import { GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import Checkbox from '@material-ui/core/Checkbox'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
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
          <ListItemIcon>
            {props.renderIcon?.(item) || (
              <Icon type={iconType.materialui} iconName="folder" style={{ color: 'primary' }} />
            )}
          </ListItemIcon>
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

  return <List>{props.items.map((item) => renderItem(item as any))}</List>
}