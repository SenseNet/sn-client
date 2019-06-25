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
import Radium from 'radium'
import { renderIconDefault } from './icon'
import { ReactClientFieldSetting } from './ClientFieldSetting'

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
export class Password extends Component<ReactClientFieldSetting, PasswordState> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: Password['props']) {
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
      if (this.props.settings.DefaultValue) {
        return this.props.settings.DefaultValue
      } else {
        return ''
      }
    }
  }

  public handleChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    this.setState({ value: event.target.value })
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
    switch (this.props.actionName) {
      case 'edit':
      case 'new':
        return (
          <FormControl>
            <InputLabel htmlFor={this.props.settings.Name as string}>{this.props.settings.DisplayName}</InputLabel>
            <Input
              type={this.state.showPassword ? 'text' : 'password'}
              name={this.props.settings.Name as string}
              id={this.props.settings.Name as string}
              placeholder={this.props.settings.DisplayName}
              defaultValue={this.state.value}
              required={this.props.settings.Compulsory}
              disabled={this.props.settings.ReadOnly}
              fullWidth={true}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="Toggle password visibility" onClick={this.handleClickShowPassword}>
                    {this.props.renderIcon
                      ? this.props.renderIcon(this.state.showPassword ? 'visibility_off' : 'visibility')
                      : renderIconDefault(this.state.showPassword ? 'visibility_off' : 'visibility')}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>{this.props.settings.Description}</FormHelperText>
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
