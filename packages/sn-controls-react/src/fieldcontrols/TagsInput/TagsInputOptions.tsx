import MenuItem from '@material-ui/core/MenuItem'
import React, { Component } from 'react'

export interface OptionProps {
  option: any
  isSelected: boolean
  onFocus: (...args: any[]) => any
  isFocused: boolean
  onSelect: (...args: any[]) => any
}

/**
 * Control that represents a Option of an autocomplete dropdown.
 */
export class Option extends Component<OptionProps, {}> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: Option['props']) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  /**
   * handles click event
   */
  public handleClick = (e: React.SyntheticEvent) => {
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
        }}>
        {children}
      </MenuItem>
    )
  }
}
