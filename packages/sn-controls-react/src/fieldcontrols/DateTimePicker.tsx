/**
 * @module FieldControls
 */
import MomentUtils from '@date-io/moment'
import {
  DateTimePicker as MUIDateTimePicker,
  MaterialUiPickersDate,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import moment from 'moment'
import React from 'react'
import { DateTimeFieldSetting } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for DateTimePicker state
 */
export interface DateTimePickerState {
  value: string
  dateValue: MaterialUiPickersDate
}
/**
 * Field control that represents a DateTime field. Available values will be populated from the FieldSettings.
 */
export class DateTimePicker extends React.Component<
  ReactClientFieldSetting<DateTimeFieldSetting>,
  DateTimePickerState
> {
  state = {
    dateValue: this.props.content[this.props.settings.Name]
      ? moment(this.setValue(this.props.content[this.props.settings.Name]))
      : moment(this.setValue(this.props.settings.DefaultValue)),
    value: this.props.content[this.props.settings.Name]
      ? this.props.content[this.props.settings.Name]
      : this.props.settings.DefaultValue,
  }

  /**
   * convert string to proper date format
   * @param {string} value
   */
  public setValue(value?: string) {
    // TODO: check datetimemode and return a value based on this property
    return value || new Date().toISOString()
  }
  /**
   * handle changes
   * @param {MaterialUiPickersDate} date
   */
  public handleDateChange = (date: MaterialUiPickersDate) => {
    if (!date) {
      return
    }
    this.setState({
      dateValue: date,
      value: moment.utc(date).toISOString(),
    })
    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, this.state.value)
  }

  public render() {
    const { dateValue } = this.state
    switch (this.props.actionName) {
      case 'edit':
      case 'new':
        return (
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <MUIDateTimePicker
              value={dateValue}
              onChange={this.handleDateChange}
              label={this.props.settings.DisplayName}
              id={this.props.settings.Name}
              disabled={this.props.settings.ReadOnly}
              placeholder={this.props.settings.DisplayName}
              required={this.props.settings.Compulsory}
              fullWidth={true}
            />
          </MuiPickersUtilsProvider>
        )
      case 'browse':
      default:
        return this.props.content[this.props.settings.Name] ? (
          <div>
            <label>{this.props.settings.DisplayName}</label>
            <p>{this.props.content[this.props.settings.Name]}</p>
          </div>
        ) : null
    }
  }
}
