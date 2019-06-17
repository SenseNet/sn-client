/* eslint-disable dot-notation */
/**
 * @module FieldControls
 */
import React, { Component } from 'react'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import { GenericContent } from '@sensenet/default-content-types'
import Radium from 'radium'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { renderIconDefault } from '../icon'
import { ReactShortTextFieldSetting } from '../ShortText/ShortTextFieldSetting'

/**
 * Interface for Password properties
 */
export interface PasswordProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactShortTextFieldSetting<T, K> {}
/**
 * Interface for Password state
 */
export interface PasswordState {
  value: string
  showPassword: boolean
}
/**
 * Field control that represents a Password field. Available values will be populated from the FieldSettings.
 */
@Radium
export class Password<T extends GenericContent, K extends keyof T> extends Component<
  PasswordProps<T, K>,
  PasswordState
> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: PasswordProps<T, K>) {
    super(props)
    /**
     * @type {object}
     * @property {string} value input value
     */
    this.state = {
      value: '',
      showPassword: false,
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
      if (this.props['defaultValue']) {
        return this.props['defaultValue']
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
    this.setState({ value: event.target['value'] })
  }
  /**
   * handle clicking on show password icon
   */
  public handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }))
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    switch (this.props['actionName']) {
      case 'edit':
        return (
          <FormControl className={this.props.className}>
            <InputLabel htmlFor={this.props.name as string}>{this.props['labelText']}</InputLabel>
            <Input
              type={this.state.showPassword ? 'text' : 'password'}
              name={this.props.name as string}
              id={this.props.name as string}
              className={this.props.className}
              placeholder={this.props['placeHolderText']}
              style={this.props.style}
              defaultValue={this.state.value}
              required={this.props.required}
              disabled={this.props.readOnly}
              error={this.props['errorText'] && this.props['errorText'].length > 0 ? true : false}
              fullWidth={true}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="Toggle password visibility" onClick={this.handleClickShowPassword}>
                    {this.props['data-renderIcon']
                      ? this.props['data-renderIcon'](this.state.showPassword ? 'visibility_off' : 'visibility')
                      : renderIconDefault(this.state.showPassword ? 'visibility_off' : 'visibility')}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>{this.props['hintText']}</FormHelperText>
            <FormHelperText>{this.props['errorText']}</FormHelperText>
          </FormControl>
        )
      case 'new':
        return (
          <FormControl className={this.props.className}>
            <InputLabel htmlFor={this.props.name as string}>{this.props['labelText']}</InputLabel>
            <Input
              type={this.state.showPassword ? 'text' : 'password'}
              name={this.props.name as string}
              id={this.props.name as string}
              className={this.props.className}
              placeholder={this.props['placeHolderText']}
              style={this.props.style}
              defaultValue={this.state.value}
              required={this.props.required}
              disabled={this.props.readOnly}
              error={this.props['errorText'] && this.props['errorText'].length > 0 ? true : false}
              fullWidth={true}
              onChange={e => this.handleChange(e)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="Toggle password visibility" onClick={this.handleClickShowPassword}>
                    {this.props['data-renderIcon']
                      ? this.props['data-renderIcon'](this.state.showPassword ? 'visibility_off' : 'visibility')
                      : renderIconDefault(this.state.showPassword ? 'visibility_off' : 'visibility')}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>{this.props['hintText']}</FormHelperText>
            <FormHelperText>{this.props['errorText']}</FormHelperText>
          </FormControl>
        )
      default:
        return (
          <div>
            <label>{this.props['labelText']}</label>
          </div>
        )
    }
  }
}
