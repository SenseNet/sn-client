/**
 * @module FieldControls
 */
import MomentUtils from '@date-io/moment'
import { MaterialUiPickersDate, TimePicker as MUITimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import moment from 'moment'
import React, { Fragment } from 'react'
import { ReactDateTimeFieldSetting } from './field-settings/DateTimeFieldSetting'

/**
 * Interface for TimePicker state
 */
export interface TimePickerState {
  value: moment.Moment
}
/**
 * Field control that represents a DateTime field. Available values will be populated from the FieldSettings.
 */
export class TimePicker extends React.Component<ReactDateTimeFieldSetting, TimePickerState> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: TimePicker['props']) {
    super(props)
    /**
     * @type {object}
     * @property {string} value default value
     */
    this.state = {
      value: props.value ? props.value : props.defaultValue,
    }
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
    this.props.fieldOnChange(this.props.fieldName, moment.utc(date) as any)
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    const { value } = this.state
    const { readOnly, required } = this.props
    switch (this.props.actionName) {
      case 'edit':
        return (
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Fragment>
              <MUITimePicker
                value={value}
                onChange={this.handleDateChange}
                label={this.props.labelText}
                id={this.props.fieldName as string}
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
              <MUITimePicker
                value={value}
                onChange={this.handleDateChange}
                label={this.props.labelText}
                id={this.props.fieldName as string}
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
