import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import produce from 'immer'
import React, { useState } from 'react'
import { Item, ItemProps } from './Item'
import { ItemList } from './ItemsList'

const items: Array<Item<{ name: string }>> = [
  {
    id: 1,
    isSelected: false,
    nodeData: {
      name: 'Content1',
    },
  },
  {
    id: 2,
    isSelected: false,
    nodeData: {
      name: 'Content2',
    },
  },
]

/**
 * Represents a list picker component.
 */
export function ListPickerComponent() {
  const [state, setState] = useState(items)
  const onClickHandler = (node: Item<{ name: string }>, event: React.MouseEvent) => {
    event.preventDefault()
    setState(
      produce(state, draftState => {
        draftState.map(item => {
          if (item.id === node.id) {
            item.isSelected = !item.isSelected
          } else {
            item.isSelected = false
          }
        })
      }),
    )
  }

  // const getSelectedItem = () => {
  //   const selectedItem = items.find(item => item.id === selectedId)
  //   return selectedItem ? selectedItem.name : 'Not found'
  // }

  const renderItem = (props: ItemProps<{ name: string }>) => (
    <ListItem button={true} selected={props.isSelected}>
      <ListItemText primary={props.nodeData!.name} />
    </ListItem>
  )

  return (
    <List>
      <ItemList items={state} onNodeClickHandler={onClickHandler} renderItem={renderItem} />
    </List>
  )
}
