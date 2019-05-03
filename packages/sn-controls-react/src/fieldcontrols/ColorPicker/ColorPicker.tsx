/**
 * @module FieldControls
 */
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import Input from '@material-ui/core/Input'
import { GenericContent } from '@sensenet/default-content-types'
import Radium from 'radium'
import React, { Component } from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'

const style = {
  input: {
    width: 80,
  },
}

/**
 * Interface for ColorPicker properties
 */
export interface ColorPickerProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K> {}
/**
 * Interface for Password state
 */
export interface ColorPickerState {
  value: string
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
      value: '',
    }

    this.handleChange = this.handleChange.bind(this)
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
        return ''
      }
    }
  }
  /**
   * handle change event on an input
   * @param {SytheticEvent} event
   */
  public handleChange(event: React.ChangeEvent) {
    // tslint:disable-next-line:no-string-literal
    this.setState({ value: event.target['value'] })
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
            <FormLabel component={'legend' as 'label'}>{this.props['data-labelText']}</FormLabel>
            <Input
              type="color"
              name={this.props.name as string}
              id={this.props.name as string}
              className={this.props.className}
              placeholder={this.props['data-placeHolderText']}
              style={{ ...this.props.style, ...style.input }}
              defaultValue={this.state.value}
              required={this.props.required}
              disabled={this.props.readOnly}
              error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
              onChange={this.handleChange}
            />
            <FormHelperText>{this.props['data-hintText']}</FormHelperText>
            <FormHelperText>{this.props['data-errorText']}</FormHelperText>
          </FormControl>
        )
      case 'new':
        return (
          <FormControl className={this.props.className}>
            <FormLabel component={'legend' as 'label'}>{this.props['data-labelText']}</FormLabel>
            <Input
              type="color"
              name={this.props.name as string}
              id={this.props.name as string}
              className={this.props.className}
              placeholder={this.props['data-placeHolderText']}
              style={{ ...this.props.style, ...style.input }}
              value={this.state.value}
              required={this.props.required}
              disabled={this.props.readOnly}
              error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
              onChange={this.handleChange}
            />
            <FormHelperText>{this.props['data-hintText']}</FormHelperText>
            <FormHelperText>{this.props['data-errorText']}</FormHelperText>
          </FormControl>
        )
      case 'browse':
        return (
          <FormControl className={this.props.className}>
            <FormLabel component={'legend' as 'label'}>{this.props['data-labelText']}</FormLabel>
            <Input
              type="color"
              name={this.props.name as string}
              id={this.props.name as string}
              className={this.props.className}
              placeholder={this.props['data-placeHolderText']}
              style={{ ...this.props.style, ...style.input }}
              value={this.state.value}
              disabled={true}
              error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
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
