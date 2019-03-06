import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'

/**
 * Item component properties.
 * @interface ItemProps
 * @template T extends GenericContent
 */
export interface ItemProps<T extends GenericContent = GenericContent> {
  /**
   * Node data.
   * @type {T}
   */
  node: T

  /**
   * Click handler for the item component.
   */
  onClickHandler?: (event: React.MouseEvent, node: T) => void

  /**
   * Click handler for the item component.
   */
  onDoubleClickHandler?: (event: React.MouseEvent, node: T) => void

  /**
   * Additional class to add to the div element.
   * @type {string}
   */
  className?: string

  /**
   * A function to render the item.
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
  return <li>{props && props.Name}</li>
}
