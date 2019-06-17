/**
 * @module FieldControls
 */
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import { GenericContent } from '@sensenet/default-content-types'
import React, { Component } from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { renderIconDefault } from '../icon'

/**
 * Interface for Boolean properties
 */
export interface BooleanProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K> {}
/**
 * Interface for Boolean state
 */
export interface BooleanState<T extends GenericContent, _K extends keyof T> {
  value: boolean
}

/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 */
export class Boolean<T extends GenericContent, K extends keyof T> extends Component<
  BooleanProps<T, K>,
  BooleanState<T, K>
> {
  /**
   * constructor
   * @param {object} props
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(props: Boolean<T, K>['props']) {
    super(props)
    this.state = {
      value: this.props['data-fieldValue'] || this.props.defaultValue || false,
    }
    this.handleChange = this.handleChange.bind(this)
  }
  /**
   * set selected value
   */
  public handleChange = () => {
    const { value } = this.state
    const newValue = !value
    this.setState({
      value: newValue,
    })
    this.props.onChange(this.props.name, newValue as any)
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    switch (this.props.actionName) {
      case 'edit':
        return (
          <FormControl
            className={this.props.className}
            component={'fieldset' as 'div'}
            required={this.props.required}
            error={this.props.errorText !== undefined && this.props.errorText.length > 0}>
            <FormControlLabel
              control={<Checkbox checked={this.state.value} onChange={this.handleChange} />}
              label={this.props.labelText}
            />
            {this.props.hintText ? <FormHelperText>{this.props.hintText}</FormHelperText> : null}
            {this.props.errorText ? <FormHelperText>{this.props.errorText}</FormHelperText> : null}
          </FormControl>
        )
      case 'new':
        return (
          <FormControl
            className={this.props.className}
            required={this.props.required}
            error={this.props.errorText !== undefined && this.props.errorText.length > 0}>
            <FormControlLabel
              control={<Checkbox checked={this.state.value} onChange={this.handleChange} />}
              label={this.props.labelText}
            />
            {this.props.hintText ? <FormHelperText>{this.props.hintText}</FormHelperText> : null}
            {this.props.errorText ? <FormHelperText>{this.props.errorText}</FormHelperText> : null}
          </FormControl>
        )
      case 'browse':
        return this.props['data-fieldValue'].length > 0 ? (
          <FormControl component={'fieldset' as 'div'} className={this.props.className}>
            <InputLabel shrink={true} htmlFor={name as string}>
              {this.props.labelText}
            </InputLabel>
            {this.props['data-renderIcon']
              ? this.props['data-renderIcon'](this.state.value ? 'check' : 'not_interested')
              : renderIconDefault(this.state.value ? 'check' : 'not_interested')}
          </FormControl>
        ) : null
      default:
        return this.props['data-fieldValue'].length > 0 ? (
          <FormControl component={'fieldset' as 'div'} className={this.props.className}>
            <InputLabel shrink={true} htmlFor={name as string}>
              {this.props.labelText}
            </InputLabel>
            {this.props['data-renderIcon']
              ? this.props['data-renderIcon'](this.state.value ? 'check' : 'not_interested')
              : renderIconDefault(this.state.value ? 'check' : 'not_interested')}
          </FormControl>
        ) : null
    }
  }
}
