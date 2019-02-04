import React from 'react'

/**
 * Item component schema.
 * @template T
 */
export interface Item<T = {}> {
  /**
   * A unique identifier for the node.
   */
  id: string | number

  /**
   * An optional custom user object to associate with the node.
   * This property can then be used in the `onClick`
   * event handlers for doing custom logic per node.
   */
  nodeData?: T
}

/**
 * Item component properties.
 * @interface ItemProps
 * @extends {Item<T>}
 * @template T
 */
export interface ItemProps<T = {}> extends Item<T> {
  /**
   * Click handler.
   * @memberof ItemProps
   */
  onClickHandler?: (node: Item<T>, event: React.MouseEvent) => void

  /**
   * Additional class to add to the div element.
   * @type {string}
   * @memberof ItemProps
   */
  className?: string

  /**
   * A function to render the item.
   * @memberof ItemProps
   */
  renderItem?: (props: ItemProps<T>) => JSX.Element
}

/**
 * Represents a generic item.
 * @template T
 * @param {ItemProps<T>} props
 * @returns JSX.Elment
 */
export function ItemComponent<T = {}>(props: ItemProps<T>) {
  const renderItem = props.renderItem || defaultRender
  const onClick = (event: React.MouseEvent<Element, MouseEvent>) => {
    props.onClickHandler && props.onClickHandler(props, event)
  }

  return (
    <div onClick={onClick} className={props.className}>
      {renderItem(props)}
    </div>
  )
}

function defaultRender<T>(props: ItemProps<T>) {
  return <li>{props.nodeData && (props.nodeData as any).name}</li>
}
