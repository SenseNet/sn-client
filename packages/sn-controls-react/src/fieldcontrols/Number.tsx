/**
 * @module FieldControls
 */
// import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Radium from 'radium'
import React, { Component } from 'react'
import { NumberFieldSetting } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from './ClientFieldSetting'

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
export class NumberComponent extends Component<ReactClientFieldSetting<NumberFieldSetting>, NumberState> {
  constructor(props: NumberComponent['props']) {
    super(props)
    this.state = {
      value: this.props.content[this.props.settings.Name]
        ? (this.setValue(this.props.content[this.props.settings.Name]) as any)
        : this.setValue(this.props.settings.DefaultValue as any),
    }
    this.handleChange = this.handleChange.bind(this)
  }

  public handleChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) {
    this.setState({ value: e.target.value })
    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, e.target.value)
  }
  /**
   * convert incoming default value string to proper format
   * @param {string} value
   */
  public setValue(value: string) {
    if (value) {
      return value
    } else {
      if (this.props.settings.DefaultValue) {
        return this.props.settings.DefaultValue
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
    return (
      this.props.settings.MinValue &&
      value > this.props.settings.MinValue &&
      (this.props.settings.MaxValue && value < this.props.settings.MaxValue)
    )
  }
  /**
   * Returns steps value by decimal and step settings
   */
  public defineStepValue = () => {
    return Number.isInteger(this.props.content[this.props.settings.Name]) && this.props.settings.Step === undefined
      ? 1
      : this.props.settings.Step
      ? this.props.settings.Step
      : 0.1
  }
  /**
   * Returns inputadornment by currency and percentage settings
   */
  public defineCurrency = () => {
    // TODO: REVIEW this
    // let currency: any
    // if (this.props.settings) {
    //   currency = this.props.currency ? (
    //     <InputAdornment position="start">{this.props.currency}</InputAdornment>
    //   ) : (
    //     <InputAdornment position="start">$</InputAdornment>
    //   )
    // } else {
    //   currency = this.props.isPercentage ? <InputAdornment position="start">%</InputAdornment> : null
    // }
    // return currency
    return ''
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
          <TextField
            name={this.props.settings.Name}
            type="number"
            label={this.props.settings.DisplayName}
            value={this.state.value}
            required={this.props.settings.Compulsory}
            disabled={this.props.settings.ReadOnly}
            InputProps={{
              startAdornment: this.defineCurrency(),
            }}
            inputProps={{
              step: this.defineStepValue(),
              max: this.props.settings.MaxValue ? this.props.settings.MaxValue : null,
              min: this.props.settings.MinValue ? this.props.settings.MinValue : null,
            }}
            id={this.props.settings.Name}
            fullWidth={true}
            onChange={this.handleChange}
            helperText={this.props.settings.Description}
          />
        )
      case 'browse':
      default:
        return this.state.value ? (
          <div>
            <Typography variant="caption" gutterBottom={true}>
              {this.props.settings.DisplayName}
            </Typography>
            <Typography variant="body1" gutterBottom={true}>
              {/* {this.props.isCurrency ? (this.props.currency ? this.props.currency : '$') : null} */}
              {this.props.settings.ShowAsPercentage ? '%' : null}
              {this.state.value}
            </Typography>
          </div>
        ) : null
    }
  }
}
