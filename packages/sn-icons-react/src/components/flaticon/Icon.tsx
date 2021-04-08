import { Icon } from '@material-ui/core'
import React from 'react'
import '../../assets/css/flaticon.css'

interface FlatIconProps {
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
   * Additional class name
   */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

/**
 * Flaticon Icon component
 */
export const FlatIcon: React.FunctionComponent<FlatIconProps> = (props) => {
  const { color, fontSize, classes, iconName, style, onClick } = props
  return (
    <Icon
      color={color || 'primary'}
      fontSize={fontSize || 'default'}
      classes={classes}
      className={`flaticon-${iconName}`}
      style={style}
      onClick={onClick}>
      {props.children}
    </Icon>
  )
}
