import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'

/**
 * Item component properties.
 * @interface ItemProps
 * @extends {Item<T>}
 * @template T
 */
export interface ItemProps<T extends GenericContent = GenericContent> {
  /**
   * Node data.
   * @type {T}
   * @memberof ItemProps
   */
  node: T

  /**
   * Click handler for the item component.
   * @memberof ItemProps
   */
  onClickHandler?: (event: React.MouseEvent, node: T) => void

  /**
   * Click handler for the item component.
   * @memberof ItemProps
   */
  onDoubleClickHandler?: (event: React.MouseEvent, node: T) => void

  /**
   * Additional class to add to the div element.
   * @type {string}
   * @memberof ItemProps
   */
  className?: string

  /**
   * A function to render the item.
   * @memberof ItemProps
   * @default function defaultRender<T extends GenericContent>(props: T) {
   *  return <li>{props && props.DisplayName}</li>
   * }
   */
  renderItem?: (props: T) => JSX.Element
}

/**
 * Represents a generic item.
 * @template T
 * @param {ItemProps<T>} props
 * @returns JSX.Elment
 */
export function ItemComponent<T extends GenericContent = GenericContent>(props: ItemProps<T>) {
  const renderItem = props.renderItem || defaultRender
  const onClick = (event: React.MouseEvent) => {
    props.onClickHandler && props.onClickHandler(event, props.node)
  }
  const onDoubleClick = (event: React.MouseEvent) => {
    props.onDoubleClickHandler && props.onDoubleClickHandler(event, props.node)
  }

  return (
    <div onClick={onClick} onDoubleClick={onDoubleClick} className={props.className}>
      {renderItem(props.node)}
    </div>
  )
}

function defaultRender<T extends GenericContent>(props: T) {
  return <li>{props && props.DisplayName}</li>
}
