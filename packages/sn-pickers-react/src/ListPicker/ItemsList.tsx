import React from 'react'
import { Item, ItemComponent, ItemProps } from './Item'

/**
 * The ItemList component properties.
 * @interface ItemListProps
 * @template T
 */
export interface ItemListProps<T extends { Id: string | number }> {
  /**
   * The data items to be rendered.
   * @type {Array<Item<T>>}
   * @memberof ItemListProps
   */
  items: Array<Item<T>>

  /**
   * The parent node.
   * @memberof ItemListProps
   */
  parentNode?: Item<T>

  /**
   * Click handler for the Item component.
   * @memberof ItemListProps
   */
  onNodeClickHandler?: (event: React.MouseEvent, node: Item<T>) => void

  /**
   * Double click handler for the Item component.
   * @memberof ItemListProps
   */
  onNodeDoubleClickHandler?: (event: React.MouseEvent, node: Item<T>) => void

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
export function ItemList<T extends { Id: string | number }>(props: ItemListProps<T>) {
  return (
    <>
      {props.parentNode !== undefined ? (
        <ItemComponent
          onClickHandler={props.onNodeClickHandler}
          onDoubleClickHandler={props.onNodeDoubleClickHandler}
          nodeData={{ ...props.parentNode.nodeData, Name: '..' }}
          renderItem={props.renderItem as any}
        />
      ) : null}
      {props.items.map(item => (
        <ItemComponent
          key={item.nodeData.Id}
          nodeData={item.nodeData}
          onClickHandler={props.onNodeClickHandler}
          onDoubleClickHandler={props.onNodeDoubleClickHandler}
          renderItem={props.renderItem}
        />
      ))}
    </>
  )
}
