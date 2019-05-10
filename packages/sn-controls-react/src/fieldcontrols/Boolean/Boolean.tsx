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
import { ReactBooleanFieldSetting } from './BooleanFieldSetting'

/**
 * Interface for Boolean properties
 */
export interface BooleanProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactBooleanFieldSetting<T, K> {}
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
  constructor(props: Boolean<T, K>['props']) {
    super(props)
    this.state = {
      value: this.props['data-fieldValue'] || this.props['data-defaultValue'] || false,
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
    switch (this.props['data-actionName']) {
      case 'edit':
        return (
          <FormControl
            className={this.props.className}
            component={'fieldset' as 'div'}
            required={this.props.required}
            error={this.props['data-errorText'] !== undefined && this.props['data-errorText'].length > 0}>
            <FormControlLabel
              control={<Checkbox checked={this.state.value} onChange={this.handleChange} />}
              label={this.props['data-labelText']}
            />
            {this.props['data-hintText'] ? <FormHelperText>{this.props['data-hintText']}</FormHelperText> : null}
            {this.props['data-errorText'] ? <FormHelperText>{this.props['data-errorText']}</FormHelperText> : null}
          </FormControl>
        )
      case 'new':
        return (
          <FormControl
            className={this.props.className}
            required={this.props.required}
            error={this.props['data-errorText'] !== undefined && this.props['data-errorText'].length > 0}>
            <FormControlLabel
              control={<Checkbox checked={this.state.value} onChange={this.handleChange} />}
              label={this.props['data-labelText']}
            />
            {this.props['data-hintText'] ? <FormHelperText>{this.props['data-hintText']}</FormHelperText> : null}
            {this.props['data-errorText'] ? <FormHelperText>{this.props['data-errorText']}</FormHelperText> : null}
          </FormControl>
        )
      case 'browse':
        return this.props['data-fieldValue'].length > 0 ? (
          <FormControl component={'fieldset' as 'div'} className={this.props.className}>
            <InputLabel shrink={true} htmlFor={name as string}>
              {this.props['data-labelText']}
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
              {this.props['data-labelText']}
            </InputLabel>
            {this.props['data-renderIcon']
              ? this.props['data-renderIcon'](this.state.value ? 'check' : 'not_interested')
              : renderIconDefault(this.state.value ? 'check' : 'not_interested')}
          </FormControl>
        ) : null
    }
  }
}
