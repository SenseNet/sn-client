/**
 * @module FieldControls
 *
 */ /** */
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { GenericContent } from '@sensenet/default-content-types'
import Radium from 'radium'
import React, { Component } from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactNumberFieldSetting } from './NumberFieldSetting'

/**
 * Interface for Number properties
 */
export interface NumberProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactNumberFieldSetting<T, K> {}
/**
 * Interface for Number state
 */
export interface NumberState<T extends GenericContent, K extends keyof T> {
  value: T[K]
}

/**
 * Field control that represents a Number field. Available values will be populated from the FieldSettings.
 */
@Radium
export class Number<T extends GenericContent, K extends keyof T = 'Name'> extends Component<
  NumberProps<T, K>,
  NumberState<T, K>
> {
  constructor(props: Number<T, K>['props']) {
    super(props)
    this.state = {
      value: this.props['data-fieldValue']
        ? (this.setValue(this.props['data-fieldValue']) as any)
        : this.setValue(this.props['data-defaultValue'] as any),
    }
    this.handleChange = this.handleChange.bind(this)
  }
  /**
   * handle changes
   * @param {string} name
   * @param {event} event
   */
  public handleChange(e: React.ChangeEvent) {
    const { name, onChange } = this.props
    // tslint:disable-next-line:no-string-literal
    const value = e.target['value']
    onChange(name, value)
  }
  /**
   * convert incoming default value string to proper format
   * @param {string} value
   */
  public setValue(value: T[K]) {
    if (value) {
      return value
    } else {
      if (this.props['data-defaultValue']) {
        return this.props['data-defaultValue']
      } else {
        return null
      }
    }
  }

  // TODO: integer, decimal+digits
  /**
   * returns whether the value is valid or not
   * @param {number} value
   */
  public isValid(value: number) {
    return this.props.min && value > this.props.min && (this.props.max && value < this.props.max)
  }
  /**
   * Returns steps value by decimal and step settings
   */
  public defineStepValue = () => {
    return this.props['data-decimal'] && this.props['data-step'] === undefined
      ? 0.1
      : this.props['data-step']
      ? this.props['data-step']
      : 1
  }
  /**
   * Returns inputadornment by currency and percentage settings
   */
  public defineCurrency = () => {
    let currency = null
    if (this.props['data-isCurrency']) {
      currency = this.props['data-currency'] ? (
        <InputAdornment position="start">{this.props['data-currency']}</InputAdornment>
      ) : (
        <InputAdornment position="start">$</InputAdornment>
      )
    } else {
      currency = this.props['data-isPercentage'] ? <InputAdornment position="start">%</InputAdornment> : null
    }
    return currency
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    console.log(this.props['data-fieldValue'])
    switch (this.props['data-actionName']) {
      case 'edit':
        return (
          <TextField
            name={this.props.name as string}
            type="number"
            label={this.props['data-labelText']}
            className={this.props.className}
            style={this.props.style}
            value={this.props['data-fieldValue']}
            required={this.props.required}
            disabled={this.props.readOnly}
            InputProps={{
              startAdornment: this.defineCurrency(),
            }}
            inputProps={{
              step: this.defineStepValue(),
              max: this.props.max ? this.props.max : null,
              min: this.props.min ? this.props.min : null,
            }}
            id={this.props.name as string}
            error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
            fullWidth={true}
            onChange={e => this.handleChange(e)}
            helperText={this.props['data-hintText']}
          />
        )
      case 'new':
        return (
          <TextField
            name={this.props.name as string}
            type="number"
            label={this.props['data-labelText']}
            className={this.props.className}
            style={this.props.style}
            defaultValue={this.props['data-defaultValue'] as any}
            required={this.props.required}
            disabled={this.props.readOnly}
            InputProps={{
              startAdornment: this.defineCurrency(),
            }}
            inputProps={{
              step: this.defineStepValue(),
              max: this.props.max ? this.props.max : null,
              min: this.props.min ? this.props.min : null,
            }}
            id={this.props.name as string}
            error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
            fullWidth={true}
            onChange={e => this.handleChange(e)}
            helperText={this.props['data-hintText']}
          />
        )
      case 'browse':
        return this.props.value ? (
          <div className={this.props.className}>
            <Typography variant="caption" gutterBottom={true}>
              {this.props['data-labelText']}
            </Typography>
            <Typography variant="body2" gutterBottom={true}>
              {this.props['data-isCurrency'] ? (this.props['data-currency'] ? this.props['data-currency'] : '$') : null}
              {this.props['data-isPercentage'] ? '%' : null}
              {this.props.value}
            </Typography>
          </div>
        ) : null
      default:
        return this.props.value ? (
          <div className={this.props.className}>
            <Typography variant="caption" gutterBottom={true}>
              {this.props['data-labelText']}
            </Typography>
            <Typography variant="body2" gutterBottom={true}>
              {this.props['data-isCurrency'] ? (this.props['data-currency'] ? this.props['data-currency'] : '$') : null}
              {this.props['data-isPercentage'] ? '%' : null}
              {this.props.value}
            </Typography>
          </div>
        ) : null
    }
  }
}
