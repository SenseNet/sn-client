import Icon from '@material-ui/core/Icon'
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
  classes?: object | null
  /**
   * Style object that is passed to the inner material-ui Icon component
   */
  style?: object | null
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
export class MaterialIcon extends React.Component<MaterialIconProps, {}> {
  /**
   * renders the component
   */
  public render() {
    const { color, fontSize, classes, iconName, style, onClick, className } = this.props
    return (
      <Icon
        color={color ? color : 'primary'}
        fontSize={fontSize ? fontSize : 'default'}
        classes={classes ? classes : undefined}
        style={style ? style : undefined}
        onClick={onClick ? onClick : undefined}
        className={className ? className : undefined}>
        {iconName}
        {this.props.children ? this.props.children : undefined}
      </Icon>
    )
  }
}
