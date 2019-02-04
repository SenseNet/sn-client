import React from 'react'
import { Item, ItemComponent, ItemProps } from './Item'

/**
 * The ItemList component properties.
 * @interface ItemListProps
 * @template T
 */
export interface ItemListProps<T = {}> {
  /**
   * The data items to be rendered.
   * @type {Array<Item<T>>}
   * @memberof ItemListProps
   */
  items: Array<Item<T>>

  /**
   * Click handler for the Item component.
   * @memberof ItemListProps
   */
  onNodeClickHandler?: (node: Item<T>, event: React.MouseEvent) => void

  /**
   * Function to render the item component.
   * @memberof ItemListProps
   */
  renderItem?: (props: ItemProps<T>) => JSX.Element
}

/**
 * Represents an Item list component.
 * @template T
 * @param {ItemListProps<T>} props
 * @returns JSX.Element
 */
export function ItemList<T = {}>(props: ItemListProps<T>) {
  return (
    <>
      {props.items.map(item => (
        <ItemComponent
          key={item.id}
          id={item.id}
          nodeData={item.nodeData}
          onClickHandler={props.onNodeClickHandler}
          renderItem={props.renderItem}
        />
      ))}
    </>
  )
}
