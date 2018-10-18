
import MenuItem from '@material-ui/core/MenuItem'
import React, { Component } from 'react'

/**
 * Control that represents a Option of an autocomplete dropdown.
 */
export class Option extends Component<{ option, children, isSelected, onFocus, isFocused, onSelect }, {}> {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }
    /**
     * handles click event
     */
    public handleClick = (e) => {
        this.props.onSelect(this.props.option, e)
    }
    /**
     * render
     */
    public render() {
        const { children, isFocused, isSelected, onFocus } = this.props

        return (
            <MenuItem
                onFocus={onFocus}
                selected={isFocused}
                onClick={this.handleClick}
                component="div"
                style={{
                    fontWeight: isSelected ? 500 : 400,
                }}
            >
                {children}
            </MenuItem>
        )
    }
}
