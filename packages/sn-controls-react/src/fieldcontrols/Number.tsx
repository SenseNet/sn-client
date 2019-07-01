/**
 * @module FieldControls
 */
// import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import React, { Component } from 'react'
import { CurrencyFieldSetting, NumberFieldSetting } from '@sensenet/default-content-types'
import InputAdornment from '@material-ui/core/InputAdornment'
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
export class NumberComponent extends Component<
  ReactClientFieldSetting<NumberFieldSetting | CurrencyFieldSetting>,
  NumberState
> {
  state: NumberState = {
    value:
      (this.props.content && this.props.content[this.props.settings.Name]) != null
        ? this.props.content![this.props.settings.Name]
        : this.props.settings.DefaultValue,
  }

  public handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    this.setState({ value: e.target.value })
    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, e.target.value)
  }

  /**
   * Returns steps value by decimal and step settings
   */
  public defineStepValue = () => {
    if (this.props.settings.Step) {
      return this.props.settings.Step
    }
    if (!this.props.content) {
      return 1
    }
    return Number.isInteger(this.props.content[this.props.settings.Name]) ? 1 : 0.1
  }

  /**
   * Returns inputadornment by currency and percentage settings
   */
  public defineCurrency = () => {
    // Todo: Currency
    // if ((this.props.settings as CurrencyFieldSetting).Format != null) {
    //   return <InputAdornment position="start">{this.props.content[this.props.settings.Name]}</InputAdornment>
    // }
    return null
  }

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
              endAdornment: this.props.settings.ShowAsPercentage ? (
                <InputAdornment position="end">%</InputAdornment>
              ) : null,
            }}
            inputProps={{
              step: this.defineStepValue(),
              max: this.props.settings.MaxValue,
              min: this.props.settings.MinValue,
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
              {this.state.value}
              {this.props.settings.ShowAsPercentage ? '%' : null}
            </Typography>
          </div>
        ) : null
    }
  }
}
