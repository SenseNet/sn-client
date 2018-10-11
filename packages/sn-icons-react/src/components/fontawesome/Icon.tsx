import Icon from '@material-ui/core/Icon'
import * as React from 'react'
import '../../assets/css/font-awesome.css'

interface FontAwesomeIconProps {
    /**
     * Name of the icon
     */
    iconName: string,
    /**
     * Color of the icon
     * @default primary
     *
     */
    color?: 'inherit' | 'primary' | 'secondary' | 'action' | 'error' | 'disabled',
    /**
     * Font size of the icon (only used on icon font-based icons)
     * @default 'default'
     *
     */
    fontSize?: 'inherit' | 'default',
    /**
     * Classes object that is passed to the inner material-ui Icon component
     */
    classes?: object,
    /**
     * Style object that is passed to the inner material-ui Icon component
     */
    style?: object,
    /**
     * Additional class name
     */
    onClick?
}
/**
 * FontAwesome Icon component
 */
export class FontAwesomeIcon extends React.Component<FontAwesomeIconProps, {}> {
    /**
     * renders the component
     */
    public render() {
        const { color, fontSize, classes, iconName, style,
            onClick } = this.props
        return <Icon
            color={color ? color : 'primary'}
            fontSize={fontSize ? fontSize : 'default'}
            classes={classes ? classes : null}
            className={`fa fa-${iconName}`}
            style={style ? style : null}
            onClick={onClick ? onClick : null}
        >
            {this.props.children ? this.props.children : null}
        </Icon>
    }
}
