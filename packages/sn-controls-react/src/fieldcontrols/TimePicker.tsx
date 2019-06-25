/**
 * @module FieldControls
 */
import MomentUtils from '@date-io/moment'
import { MaterialUiPickersDate, TimePicker as MUITimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import moment from 'moment'
import React, { Fragment } from 'react'
import { DateTimeFieldSetting } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for TimePicker state
 */
export interface TimePickerState {
  value: moment.Moment
}
/**
 * Field control that represents a DateTime field. Available values will be populated from the FieldSettings.
 */
export class TimePicker extends React.Component<ReactClientFieldSetting<DateTimeFieldSetting>, TimePickerState> {
  state = {
    value: this.props.content[this.props.settings.Name] || this.props.settings.DefaultValue,
  }

  /**
   * convert string to proper date format
   * @param {string} value
   */
  public setValue(value: string) {
    // TODO: check datetimemode and return a value based on this property
    let date = ''
    if (value) {
      date = value.split('T')[0]
    } else {
      date = new Date().toISOString().split('T')[0]
    }
    return date
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
      value: moment.utc(date),
    })
    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, moment.utc(date) as any)
  }

  public render() {
    const { value } = this.state
    switch (this.props.actionName) {
      case 'edit':
      case 'new':
        return (
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Fragment>
              <MUITimePicker
                value={value}
                onChange={this.handleDateChange}
                label={this.props.settings.DisplayName}
                id={this.props.settings.Name as string}
                disabled={this.props.settings.ReadOnly}
                placeholder={this.props.settings.DisplayName}
                required={this.props.settings.Compulsory}
                fullWidth={true}
              />
            </Fragment>
          </MuiPickersUtilsProvider>
        )
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
