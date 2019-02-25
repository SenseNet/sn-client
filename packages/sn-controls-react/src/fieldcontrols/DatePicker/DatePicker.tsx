/**
 * @module FieldControls
 */
import MomentUtils from '@date-io/moment'
import { GenericContent } from '@sensenet/default-content-types'
import { DatePicker as MUIDatePicker } from 'material-ui-pickers'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import moment from 'moment'
import React from 'react'
import { Fragment } from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactDateTimeFieldSetting } from '../DateTimeFieldSetting'

/**
 * Interface for DatePicker properties
 */
export interface DatePickerProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactDateTimeFieldSetting<T, K> {}
/**
 * Interface for DatePicker state
 */
export interface DatePickerState<T extends GenericContent, _K extends keyof T> {
  dateValue: Date
  value: moment.Moment
}
/**
 * Field control that represents a Date field. Available values will be populated from the FieldSettings.
 */
export class DatePicker<T extends GenericContent, K extends keyof T> extends React.Component<
  DatePickerProps<T, K>,
  DatePickerState<T, K>
> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: DatePicker<T, K>['props']) {
    super(props)
    /**
     * @type {object}
     * @property {string} value default value
     */
    this.state = {
      dateValue: props['data-fieldValue']
        ? new Date(this.setValue(props['data-fieldValue']))
        : props['data-defaultValue']
        ? new Date(this.setValue(props['data-defaultValue'].toString()))
        : new Date(),
      value: props['data-fieldValue'] ? props['data-fieldValue'] : props['data-defaultValue'],
    }
    this.handleDateChange = this.handleDateChange.bind(this)
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
   * @param {Date} date
   */
  public handleDateChange = (date: Date) => {
    this.setState({
      dateValue: date,
      value: moment.utc(date),
    })
    this.props.onChange(this.props.name, moment.utc(date) as any)
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    const { value } = this.state
    const { readOnly, required } = this.props
    switch (this.props['data-actionName']) {
      case 'edit':
        return (
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Fragment>
              <MUIDatePicker
                value={value}
                onChange={this.handleDateChange}
                label={this.props['data-labelText']}
                id={this.props.name as string}
                disabled={readOnly}
                placeholder={this.props['data-placeHolderText']}
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
              <MUIDatePicker
                value={value}
                onChange={this.handleDateChange}
                label={this.props['data-labelText']}
                id={this.props.name as string}
                disabled={readOnly}
                placeholder={this.props['data-placeHolderText']}
                required={required}
                fullWidth={true}
              />
            </Fragment>
          </MuiPickersUtilsProvider>
        )
      case 'browse':
        return (
          <div>
            <label>{this.props['data-labelText']}</label>
            <p>{this.props['data-fieldValue']}</p>
          </div>
        )
      default:
        return (
          <div>
            <label>{this.props['data-labelText']}</label>
            <p>{this.props['data-fieldValue']}</p>
          </div>
        )
    }
  }
}
