/**
 * @module FieldControls
 */
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Icon from '@material-ui/core/Icon'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Radium from 'radium'
import React, { Component } from 'react'
import { SketchPicker } from 'react-color'
import { ReactClientFieldSetting } from './ClientFieldSetting'

const style = {
  input: {
    width: 80,
  },
  pickerContainer: {
    position: 'absolute',
    left: '24px',
    top: '20px',
  } as React.CSSProperties,
}

const renderIconDefault = (name: string, color: string) => {
  return <Icon style={{ color }}>{name}</Icon>
}

/**
 * Interface for ColorPicker state
 */
export interface ColorPickerState {
  value: string
  pickerIsOpen: boolean
}
/**
 * Field control that represents a Color field. Available values will be populated from the FieldSettings.
 */
@Radium
export class ColorPicker extends Component<ReactClientFieldSetting, ColorPickerState> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: ColorPicker['props']) {
    super(props)
    /**
     * @type {object}
     * @property {string} value input value
     */
    this.state = {
      value: this.setValue(this.props.content[this.props.settings.Name]).toString(),
      pickerIsOpen: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.openPicker = this.openPicker.bind(this)
    this.closePicker = this.closePicker.bind(this)
  }
  /**
   * convert incoming default value string to proper format
   * @param {string} value
   */
  public setValue(value: string) {
    if (value) {
      return value.replace(/<[^>]*>/g, '')
    } else {
      if (this.props.settings.DefaultValue) {
        return this.props.settings.DefaultValue
      } else {
        return '#016d9e'
      }
    }
  }
  /**
   * handle change event on an input
   * @param {SytheticEvent} event
   */
  public handleChange(color: any) {
    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, color.hex)
    this.setState({ value: color.hex })
  }
  public openPicker() {
    this.setState({
      pickerIsOpen: true,
    })
  }
  public closePicker() {
    this.setState({
      pickerIsOpen: false,
    })
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    switch (this.props.actionName) {
      case 'edit':
      case 'new':
        return (
          <FormControl>
            <TextField
              label={this.props.settings.DisplayName}
              type="text"
              name={this.props.settings.Name}
              id={this.props.settings.Name}
              required={this.props.settings.Compulsory}
              disabled={this.props.settings.ReadOnly}
              value={this.state.value}
              onClick={this.openPicker}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {this.props.renderIcon
                      ? this.props.renderIcon('lens')
                      : renderIconDefault('lens', this.state.value)}
                  </InputAdornment>
                ),
              }}
            />
            {this.state.pickerIsOpen ? (
              <ClickAwayListener onClickAway={this.closePicker}>
                <div style={style.pickerContainer}>
                  <SketchPicker
                    color={this.state.value}
                    onChangeComplete={this.handleChange}
                    onSwatchHover={this.handleChange}
                    disableAlpha={true}
                  />
                </div>
              </ClickAwayListener>
            ) : null}
            <FormHelperText>{this.props.settings.Description}</FormHelperText>
          </FormControl>
        )
      case 'browse':
        return (
          <FormControl>
            <TextField
              type="text"
              name={this.props.settings.Name}
              id={this.props.settings.Name}
              label={this.props.settings.DisplayName}
              disabled={true}
              value={this.state.value}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {this.props.renderIcon
                      ? this.props.renderIcon('lens')
                      : renderIconDefault('lens', this.state.value)}
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        )
      default:
        return (
          <div>
            <label>{this.props.settings.DisplayName}</label>
          </div>
        )
    }
  }
}
