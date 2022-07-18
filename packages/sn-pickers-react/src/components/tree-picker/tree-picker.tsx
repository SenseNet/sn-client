import { GenericContent } from '@sensenet/default-content-types'
import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core'
import { ArrowUpward, Folder } from '@material-ui/icons'
import React, { MouseEvent, useCallback, useEffect, useState } from 'react'
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

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [parentNode, setParentNode] = useState<any[]>([])

  useEffect(() => {
    const setDefaultParent = setTimeout(() => {
      setSelection([props.currentParent as GenericContent])
    }, 50)

    return () => {
      clearTimeout(setDefaultParent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClickSelectListItem = useCallback(
    (_event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, index: number, node: T) => {
      if (selectedIndex === index) {
        setSelectedIndex(0)

        if (parentNode.length === 0) {
          setSelection([props.currentParent as GenericContent])
          props.setDestination?.(props.currentParent?.DisplayName)
        } else {
          setSelection(parentNode)
          props.setDestination?.(parentNode[0].DisplayName)
        }
      } else {
        setSelectedIndex(index)

        if (!node.isParent) {
          const newSelection = props.allowMultiple ? selection.filter((item) => item.Id !== node.Id) : []

          if (newSelection.length === selection.length || (!props.allowMultiple && selection[0].Id !== node.Id)) {
            newSelection.push(node)
            props.setDestination?.(node.DisplayName)
          }

          setSelection(newSelection)
        }
      }
    },
    [selectedIndex, parentNode, setSelection, props, selection],
  )

  const onDoubleClickHandler = useCallback(
    (_event: MouseEvent, node: T) => {
      if (node.IsFolder || node.isParent) {
        navigateTo(node)
        props.onTreeNavigation?.(node.Path)
        setSelection([node])
        setParentNode([node])
        props.setDestination?.(node.DisplayName)
      }
    },
    [navigateTo, props, setSelection],
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
        <ListItem
          key={item.Id}
          button={true}
          selected={selectedIndex === item.Id}
          data-test={`picker-checkbox-item-${item.Name.replace(/\s+/g, '-').toLowerCase()}`}
          onClick={(e) => onClickSelectListItem(e, item.Id, item as any)}>
          <ListItemIcon>{props.renderIcon?.(item) || <Folder style={{ color: 'primary' }} />}</ListItemIcon>
          <ListItemText
            id={labelId}
            primary={item.DisplayName}
            secondary={item.Path.replace(new RegExp('^/Root', 'g'), '')}
          />
        </ListItem>
      )
    },
    [onClickSelectListItem, props, selectedIndex],
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
      {items?.map((item: { Id: React.Key | null | undefined }) => (
        <div onDoubleClick={(e) => onDoubleClickHandler(e, item as any)} key={item.Id}>
          {renderItem(item as any)}
        </div>
      ))}
    </List>
  )
}
