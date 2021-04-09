import { Icon } from '@material-ui/core'
import React from 'react'

import '../../assets/css/material.css'

interface MaterialIconProps {
  /**
   * Name of the icon
   */
  iconName: string
  /**
   * Color of the icon
   *
   * @default primary
   */
  color?: 'inherit' | 'primary' | 'secondary' | 'action' | 'error' | 'disabled'
  /**
   * Font size of the icon (only used on icon font-based icons)
   *
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
 * Material Icon component
 */
export const MaterialIcon: React.FunctionComponent<MaterialIconProps> = (props) => {
  const { color, fontSize, classes, iconName, style, onClick, className } = props
  return (
    <Icon
      color={color || 'primary'}
      fontSize={fontSize || 'default'}
      classes={classes}
      style={style}
      onClick={onClick}
      className={className}>
      {iconName}
      {props.children}
    </Icon>
  )
}
