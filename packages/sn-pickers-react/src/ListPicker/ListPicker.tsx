import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useState } from 'react'
import { useAsync } from 'react-use'
import { Item, ItemProps } from './Item'
import { ItemList } from './ItemsList'

/**
 * Properties for list picker component.
 * @interface ListPickerProps
 * @template T
 */
export interface ListPickerProps<T> {
  loadItems: () => Promise<Array<Item<T>>>
}

/**
 * Represents a list picker component.
 */
export function ListPickerComponent<T extends GenericContent>(props: ListPickerProps<T>) {
  const { loading, value: items } = useAsync(props.loadItems)
  const [selectedId, setSelectedId] = useState<string | number>(0)
  const onClickHandler = (node: Item<T>, event: React.MouseEvent) => {
    event.preventDefault()
    setSelectedId(node.id)
  }

  // const getSelectedItem = () => {
  //   const selectedItem = items.find(item => item.id === selectedId)
  //   return selectedItem ? selectedItem.name : 'Not found'
  // }

  const renderItem = (renderItemProps: ItemProps<T>) => (
    <ListItem button={true} selected={renderItemProps.id === selectedId}>
      <ListItemText primary={renderItemProps.nodeData!.Name} />
    </ListItem>
  )

  return (
    <List>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ItemList items={items!} onNodeClickHandler={onClickHandler} renderItem={renderItem} />
        </>
      )}
    </List>
  )
}
