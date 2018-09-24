import Icon from '@material-ui/core/Icon'
import * as React from 'react'
import '../../assets/css/font-awesome.css'

interface FontAwesomeIconProps {
    iconName: string,
    color?: 'inherit' | 'primary' | 'secondary' | 'action' | 'error' | 'disabled',
    fontSize?: 'inherit' | 'default',
    classes?: object,
    style?: object,
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
        />
    }
}
