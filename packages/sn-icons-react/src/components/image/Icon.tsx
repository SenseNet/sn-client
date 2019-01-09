import React from 'react'

interface ImageIconProps {
  /**
   * Name of the icon
   */
  iconName: string
  /**
   * Size of the icon (only used on image icons)
   * @default 16
   *
   */
  size?: 16 | 32
  /**
   * Style object that is passed to the inner material-ui Icon component
   */
  style?: object | null
  /**
   * Called when the icon is clicked
   */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}
/**
 * Image Icon component
 */
export class ImageIcon extends React.Component<ImageIconProps, {}> {
  /**
   * renders the component
   */
  public render() {
    const { iconName, size, style, onClick } = this.props
    const imgSize = size ? size : 16

    // tslint:disable-next-line:no-var-requires
    const image = require(`../../assets/img/icons/${imgSize}/${iconName}.png`)

    const styler = {
      backgroundImage: `url(${image})`,
      width: `${imgSize}px`,
      height: `${imgSize}px`,
      position: 'relative',
    }
    const styles = style ? style : null
    return (
      <span style={{ ...(styler as any), ...styles }} onClick={onClick ? onClick : undefined}>
        {this.props.children ? this.props.children : null}
      </span>
    )
  }
}
