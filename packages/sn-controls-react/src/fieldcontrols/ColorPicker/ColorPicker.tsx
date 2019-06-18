/**
 * @module FieldControls
 */
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Icon from '@material-ui/core/Icon'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import { GenericContent } from '@sensenet/default-content-types'
import Radium from 'radium'
import React, { Component } from 'react'
import { SketchPicker } from 'react-color'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactColorPickerFieldSetting } from './ColorPickerFieldSetting'

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
 * Interface for ColorPicker properties
 */
export interface ColorPickerProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactColorPickerFieldSetting<T, K> {}
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
export class ColorPicker<T extends GenericContent, K extends keyof T> extends Component<
  ColorPickerProps<T, K>,
  ColorPickerState
> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: ColorPickerProps<T, K>) {
    super(props)
    /**
     * @type {object}
     * @property {string} value input value
     */
    this.state = {
      value: this.setValue(this.props.value).toString(),
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
      if (this.props.defaultValue) {
        return this.props.defaultValue
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
    this.props.onChange(this.props.name, color.hex)
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
          <FormControl className={this.props.className}>
            <TextField
              label={
                this.props.errorText && this.props.errorText.length > 0 ? this.props.errorText : this.props.labelText
              }
              type="text"
              name={this.props.name as string}
              id={this.props.name as string}
              className={this.props.className}
              required={this.props.required}
              disabled={this.props.readOnly}
              value={this.state.value}
              error={this.props.errorText && this.props.errorText.length > 0 ? true : false}
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
                    presetColors={this.props.palette ? this.props.palette : []}
                    disableAlpha={true}
                  />
                </div>
              </ClickAwayListener>
            ) : null}
            <FormHelperText>{this.props.hintText}</FormHelperText>
            <FormHelperText>{this.props.errorText}</FormHelperText>
          </FormControl>
        )
      case 'browse':
        return (
          <FormControl className={this.props.className}>
            <TextField
              type="text"
              name={this.props.name as string}
              id={this.props.name as string}
              label={
                this.props.errorText && this.props.errorText.length > 0 ? this.props.errorText : this.props.labelText
              }
              className={this.props.className}
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
            <label>{this.props.labelText}</label>
          </div>
        )
    }
  }
}
