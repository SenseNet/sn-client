import Icon from '@material-ui/core/Icon'
import * as React from 'react'

interface MaterialIconProps {
    iconName: string,
    color?: 'inherit' | 'primary' | 'secondary' | 'action' | 'error' | 'disabled',
    fontSize?: 'inherit' | 'default',
    classes?: object,
    style?: object,
    onClick?
    className?: string,
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
        return <Icon
            color={color ? color : 'primary'}
            fontSize={fontSize ? fontSize : 'default'}
            classes={classes ? classes : null}
            style={style ? style : null}
            onClick={onClick ? onClick : null}
            className={className ? className : null}
        >{iconName}</Icon>
    }
}
