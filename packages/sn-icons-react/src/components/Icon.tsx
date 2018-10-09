import * as React from 'react'
import { FlatIcon } from './flaticon/Icon'
import { FontAwesomeIcon } from './fontawesome/Icon'
import { ImageIcon } from './image/Icon'
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
    /**
     * Image icons
     */
    image,
}

interface IconProps {
    iconName: string,
    type?: iconType,
    color?: 'inherit' | 'primary' | 'secondary' | 'action' | 'error' | 'disabled',
    size?: 16 | 32,
    fontSize?: 'inherit' | 'default',
    classes?: object,
    style?: object,
    onClick?
    className?: string,
}

/**
 * Main Icon component
 */
export class Icon extends React.Component<IconProps, {}> {
    /**
     * renders the component
     */
    public render() {
        const { type, color, size, classes, iconName, style, onClick, className, fontSize } = this.props
        switch (type) {
            case iconType.materialui:
                return <MaterialIcon color={color} fontSize={fontSize} classes={classes} iconName={iconName} style={style} onClick={onClick} className={className}>{this.props.children ? this.props.children : null}</MaterialIcon>
            case iconType.flaticon:
                return <FlatIcon color={color} fontSize={fontSize} classes={classes} iconName={iconName} style={style} onClick={onClick}>{this.props.children ? this.props.children : null}</FlatIcon>
            case iconType.fontawesome:
                return <FontAwesomeIcon color={color} fontSize={fontSize} classes={classes} iconName={iconName} style={style} onClick={onClick}>{this.props.children ? this.props.children : null}</FontAwesomeIcon>
            case iconType.image:
                return <ImageIcon iconName={iconName} size={size} style={style} onClick={onClick}>{this.props.children ? this.props.children : null}</ImageIcon>
            default:
                return <MaterialIcon
                    iconName={iconName}
                    color={color ? color : 'primary'}
                    fontSize={fontSize ? fontSize : 'default'}
                    classes={classes ? classes : null}
                    className={className}
                    onClick={onClick}
                    style={style}></MaterialIcon>
        }
    }
}
