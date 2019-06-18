/**
 * @module FieldControls
 */
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
export interface NumberState {
  value: string
}

/**
 * Field control that represents a Number field. Available values will be populated from the FieldSettings.
 */
@Radium
export class Number<T extends GenericContent, K extends keyof T = 'Name'> extends Component<
  NumberProps<T, K>,
  NumberState
> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(props: Number<T, K>['props']) {
    super(props)
    this.state = {
      value: this.props.value
        ? (this.setValue(this.props.value) as any)
        : this.setValue(this.props.defaultValue as any),
    }
    this.handleChange = this.handleChange.bind(this)
  }

  public handleChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) {
    const { name, onChange } = this.props
    const { value } = e.target
    this.setState({ value })
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
      if (this.props.defaultValue) {
        return this.props.defaultValue
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
    return this.props.decimal && this.props.step === undefined ? 0.1 : this.props.step ? this.props.step : 1
  }
  /**
   * Returns inputadornment by currency and percentage settings
   */
  public defineCurrency = () => {
    let currency: any
    if (this.props.isCurrency) {
      currency = this.props.currency ? (
        <InputAdornment position="start">{this.props.currency}</InputAdornment>
      ) : (
        <InputAdornment position="start">$</InputAdornment>
      )
    } else {
      currency = this.props.isPercentage ? <InputAdornment position="start">%</InputAdornment> : null
    }
    return currency
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    switch (this.props.actionName) {
      case 'edit':
        return (
          <TextField
            name={this.props.name as string}
            type="number"
            label={this.props.labelText}
            className={this.props.className}
            style={this.props.style}
            value={this.state.value}
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
            error={this.props.errorText && this.props.errorText.length > 0 ? true : false}
            fullWidth={true}
            onChange={this.handleChange}
            helperText={this.props.hintText}
          />
        )
      case 'new':
        return (
          <TextField
            name={this.props.name as string}
            type="number"
            label={this.props.labelText}
            className={this.props.className}
            style={this.props.style}
            defaultValue={this.props.defaultValue as any}
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
            error={this.props.errorText && this.props.errorText.length > 0 ? true : false}
            fullWidth={true}
            onChange={this.handleChange}
            helperText={this.props.hintText}
          />
        )
      case 'browse':
        return this.state.value ? (
          <div className={this.props.className}>
            <Typography variant="caption" gutterBottom={true}>
              {this.props.labelText}
            </Typography>
            <Typography variant="body1" gutterBottom={true}>
              {this.props.isCurrency ? (this.props.currency ? this.props.currency : '$') : null}
              {this.props.isPercentage ? '%' : null}
              {this.state.value}
            </Typography>
          </div>
        ) : null
      default:
        return this.state.value ? (
          <div className={this.props.className}>
            <Typography variant="caption" gutterBottom={true}>
              {this.props.labelText}
            </Typography>
            <Typography variant="body1" gutterBottom={true}>
              {this.props.isCurrency ? (this.props.currency ? this.props.currency : '$') : null}
              {this.props.isPercentage ? '%' : null}
              {this.state.value}
            </Typography>
          </div>
        ) : null
    }
  }
}
