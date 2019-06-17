/**
 * @module FieldControls
 */
import MomentUtils from '@date-io/moment'
import { DatePicker as MUIDatePicker, MaterialUiPickersDate, MuiPickersUtilsProvider } from '@material-ui/pickers'

import { GenericContent } from '@sensenet/default-content-types'
import moment from 'moment'
import React, { Fragment } from 'react'

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
  dateValue: MaterialUiPickersDate
  value: MaterialUiPickersDate
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
        ? moment(this.setValue(props['data-fieldValue']))
        : props.defaultValue
        ? moment(this.setValue(props.defaultValue.toString()))
        : moment(),
      value: props['data-fieldValue'] ? props['data-fieldValue'] : props.defaultValue,
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
   * @param {MaterialUiPickersDate} date
   */
  public handleDateChange = (date: MaterialUiPickersDate) => {
    if (!date) {
      return
    }
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
    switch (this.props.actionName) {
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
