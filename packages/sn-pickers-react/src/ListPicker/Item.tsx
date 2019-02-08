import React from 'react'

/**
 * Item component schema.
 * @template T
 */
export interface Item<T extends { Id: string | number }> {
  /**
   * An optional custom user object to associate with the node.
   * This property can then be used in the `onClick`
   * event handlers for doing custom logic per node.
   */
  nodeData: T
}

/**
 * Item component properties.
 * @interface ItemProps
 * @extends {Item<T>}
 * @template T
 */
export interface ItemProps<T extends { Id: string | number }> extends Item<T> {
  /**
   * Click handler for the item component.
   * @memberof ItemProps
   */
  onClickHandler?: (event: React.MouseEvent, node: Item<T>) => void

  /**
   * Click handler for the item component.
   * @memberof ItemProps
   */
  onDoubleClickHandler?: (event: React.MouseEvent, node: Item<T>) => void

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
export function ItemComponent<T extends { Id: string | number }>(props: ItemProps<T>) {
  const renderItem = props.renderItem || defaultRender
  const onClick = (event: React.MouseEvent) => {
    props.onClickHandler && props.onClickHandler(event, props)
  }
  const onDoubleClick = (event: React.MouseEvent) => {
    props.onDoubleClickHandler && props.onDoubleClickHandler(event, props)
  }

  return (
    <div onClick={onClick} onDoubleClick={onDoubleClick} className={props.className}>
      {renderItem(props)}
    </div>
  )
}

function defaultRender<T extends { Id: string | number }>(props: ItemProps<T>) {
  return <li>{props.nodeData && (props.nodeData as any).name}</li>
}
