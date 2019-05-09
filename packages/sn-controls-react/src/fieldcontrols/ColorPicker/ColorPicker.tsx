/**
 * @module FieldControls
 */
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import LensIcon from '@material-ui/icons/Lens'
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
  },
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
      value: this.setValue(this.props['data-fieldValue']).toString(),
      pickerIsOpen: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.togglePicker = this.togglePicker.bind(this)
  }
  /**
   * convert incoming default value string to proper format
   * @param {string} value
   */
  public setValue(value: string) {
    if (value) {
      return value.replace(/<[^>]*>/g, '')
    } else {
      if (this.props['data-defaultValue']) {
        return this.props['data-defaultValue']
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
  public togglePicker() {
    if (!this.props.readOnly) {
      this.setState({
        pickerIsOpen: !this.state.pickerIsOpen,
      })
    }
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    switch (this.props['data-actionName']) {
      case 'edit':
        return (
          <FormControl className={this.props.className}>
            <TextField
              label={
                this.props['data-errorText'] && this.props['data-errorText'].length > 0
                  ? this.props['data-errorText']
                  : this.props['data-labelText']
              }
              type="text"
              name={this.props.name as string}
              id={this.props.name as string}
              className={this.props.className}
              required={this.props.required}
              disabled={this.props.readOnly}
              value={this.state.value}
              error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
              onClick={this.togglePicker}
              onBlur={this.togglePicker}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LensIcon style={{ color: this.state.value }} />
                  </InputAdornment>
                ),
              }}
            />
            <div
              style={
                this.state.pickerIsOpen
                  ? { ...{ display: 'block' }, ...(style.pickerContainer as any) }
                  : { ...{ display: 'none' }, ...(style.pickerContainer as any) }
              }>
              <SketchPicker
                color={this.state.value}
                onChangeComplete={this.handleChange}
                onSwatchHover={this.handleChange}
                presetColors={this.props.palette ? this.props.palette : []}
              />
            </div>
            <FormHelperText>{this.props['data-hintText']}</FormHelperText>
            <FormHelperText>{this.props['data-errorText']}</FormHelperText>
          </FormControl>
        )
      case 'new':
        return (
          <FormControl className={this.props.className}>
            <TextField
              type="text"
              name={this.props.name as string}
              id={this.props.name as string}
              label={
                this.props['data-errorText'] && this.props['data-errorText'].length > 0
                  ? this.props['data-errorText']
                  : this.props['data-labelText']
              }
              className={this.props.className}
              required={this.props.required}
              disabled={this.props.readOnly}
              value={this.state.value}
              error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
              onClick={this.togglePicker}
              onBlur={this.togglePicker}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LensIcon style={{ color: this.state.value }} />
                  </InputAdornment>
                ),
              }}
            />
            <div
              style={
                this.state.pickerIsOpen
                  ? { ...{ display: 'block' }, ...(style.pickerContainer as any) }
                  : { ...{ display: 'none' }, ...(style.pickerContainer as any) }
              }>
              <SketchPicker
                color={this.state.value}
                onChangeComplete={this.handleChange}
                onSwatchHover={this.handleChange}
                presetColors={this.props.palette ? this.props.palette : []}
              />
            </div>
            <FormHelperText>{this.props['data-hintText']}</FormHelperText>
            <FormHelperText>{this.props['data-errorText']}</FormHelperText>
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
                this.props['data-errorText'] && this.props['data-errorText'].length > 0
                  ? this.props['data-errorText']
                  : this.props['data-labelText']
              }
              className={this.props.className}
              disabled={true}
              value={this.state.value}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LensIcon style={{ color: this.state.value }} />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        )
      default:
        return (
          <div>
            <label>{this.props['data-labelText']}</label>
          </div>
        )
    }
  }
}
