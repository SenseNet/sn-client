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
import React, { Fragment } from 'react'
import { ReactDateTimeFieldSetting } from './field-settings/DateTimeFieldSetting'

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
export class DateTimePicker extends React.Component<ReactDateTimeFieldSetting, DateTimePickerState> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: DateTimePicker['props']) {
    super(props)
    /**
     * @type {object}
     * @property {string} value default value
     */
    this.state = {
      dateValue: props.value ? moment(this.setValue(props.value)) : moment(this.setValue(props.defaultValue as string)),
      value: props.value ? props.value : props.defaultValue,
    }
    this.handleDateChange = this.handleDateChange.bind(this)
  }

  /**
   * convert string to proper date format
   * @param {string} value
   */
  public setValue(value: string) {
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
    this.props.fieldOnChange(this.props.fieldName, this.state.value)
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    const { dateValue } = this.state
    const { readOnly, required } = this.props
    switch (this.props.actionName) {
      case 'edit':
        return (
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Fragment>
              <MUIDateTimePicker
                value={dateValue}
                onChange={this.handleDateChange}
                label={this.props.labelText}
                id={this.props.fieldName}
                disabled={readOnly}
                placeholder={this.props.placeHolderText}
                required={required}
                fullWidth={true}
              />
            </Fragment>
          </MuiPickersUtilsProvider>
        )
      case 'new':
        return (
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Fragment>
              <MUIDateTimePicker
                value={dateValue}
                onChange={this.handleDateChange}
                label={this.props.labelText}
                id={this.props.fieldName}
                disabled={readOnly}
                placeholder={this.props.placeHolderText}
                required={required}
                fullWidth={true}
              />
            </Fragment>
          </MuiPickersUtilsProvider>
        )
      case 'browse':
        return (
          <div>
            <label>{this.props.labelText}</label>
            <p>{this.props.value}</p>
          </div>
        )
      default:
        return (
          <div>
            <label>{this.props.labelText}</label>
            <p>{this.props.value}</p>
          </div>
        )
    }
  }
}
