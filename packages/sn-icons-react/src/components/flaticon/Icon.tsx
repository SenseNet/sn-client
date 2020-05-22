import React from 'react'
import Icon from '@material-ui/core/Icon'
import '../../../assets/css/flaticon.css'

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
  classes?: object | null
  /**
   * Style object that is passed to the inner material-ui Icon component
   */
  style?: object | null
  /**
   * Additional class name
   */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

/**
 * Flaticon Icon component
 */
export class FlatIcon extends React.Component<FlatIconProps, {}> {
  /**
   * renders the component
   */
  public render() {
    const { color, fontSize, classes, iconName, style, onClick } = this.props
    return (
      <Icon
        color={color ? color : 'primary'}
        fontSize={fontSize ? fontSize : 'default'}
        classes={classes ? classes : undefined}
        className={`flaticon-${iconName}`}
        style={style ? style : undefined}
        onClick={onClick ? onClick : undefined}>
        {this.props.children ? this.props.children : undefined}
      </Icon>
    )
  }
}
