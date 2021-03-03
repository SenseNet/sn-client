import React from 'react'
import { FlatIcon } from './flaticon/Icon'
import { FontAwesomeIcon } from './fontawesome/Icon'
import { MaterialIcon } from './materialui/Icon'

/**
 * Enum for icon types
 */
export enum iconType {
  /**
   * Material-ui icons
   */
  materialui,
  /**
   * Fontawesome icons
   */
  fontawesome,
  /**
   * Flaticon icons
   */
  flaticon,
}

interface IconProps {
  /**
   * Name of the icon
   */
  iconName: string
  /**
   * Type of the icon (name of the icon library e.g. fontawesome)
   * @default iconType.materialui
   */
  type?: iconType
  /**
   * Color of the icon
   * @default primary
   */
  color?: 'inherit' | 'primary' | 'secondary' | 'action' | 'error' | 'disabled'
  /**
   * Font size of the icon (only used on icon font-based icons)
   * @default default
   */
  fontSize?: 'inherit' | 'default'
  /**
   * Classes object that is passed to the inner material-ui Icon component
   */
  classes?: object
  /**
   * Style object that is passed to the inner material-ui Icon component
   */
  style?: object
  /**
   * Called when the icon is clicked
   */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  /**
   * Additional class name
   */
  className?: string
}

/**
 * Main Icon component
 */
export const Icon: React.FunctionComponent<IconProps> = (props) => {
  const { type, color, classes, iconName, style, onClick, className, fontSize } = props
  switch (type) {
    case iconType.materialui:
      return (
        <MaterialIcon
          color={color}
          fontSize={fontSize}
          classes={classes}
          iconName={iconName}
          style={style}
          onClick={onClick}
          className={className}>
          {props.children}
        </MaterialIcon>
      )
    case iconType.flaticon:
      return (
        <FlatIcon
          color={color}
          fontSize={fontSize}
          classes={classes}
          iconName={iconName}
          style={style}
          onClick={onClick}>
          {props.children}
        </FlatIcon>
      )
    case iconType.fontawesome:
      return (
        <FontAwesomeIcon
          color={color}
          fontSize={fontSize}
          classes={classes}
          iconName={iconName}
          style={style}
          onClick={onClick}>
          {props.children}
        </FontAwesomeIcon>
      )
    default:
      return (
        <MaterialIcon
          iconName={iconName}
          color={color || 'primary'}
          fontSize={fontSize || 'default'}
          classes={classes}
          className={className}
          onClick={onClick}
          style={style}
        />
      )
  }
}
