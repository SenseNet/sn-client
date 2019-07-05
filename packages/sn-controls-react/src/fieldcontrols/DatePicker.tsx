/**
 * @module FieldControls
 */
import MomentUtils from '@date-io/moment'
import {
  DateTimePicker,
  MaterialUiPickersDate,
  DatePicker as MUIDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import moment from 'moment'
import React, { useState } from 'react'
import { DateTimeFieldSetting, DateTimeMode } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Field control that represents a Date field. Available values will be populated from the FieldSettings.
 */
export function DatePicker(props: ReactClientFieldSetting<DateTimeFieldSetting>) {
  const initialState = props.fieldValue || props.settings.DefaultValue || moment().toISOString()
  const [value, setValue] = useState(initialState)

  const handleDateChange = (date: MaterialUiPickersDate) => {
    if (!date) {
      return
    }
    setValue(date.toISOString())
    props.fieldOnChange && props.fieldOnChange(props.settings.Name, moment.utc(date).toISOString())
  }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
          {props.settings.DateTimeMode === DateTimeMode.Date ? (
            <MUIDatePicker
              value={value}
              onChange={handleDateChange}
              label={props.settings.DisplayName}
              id={props.settings.Name as string}
              disabled={props.settings.ReadOnly}
              placeholder={props.settings.DisplayName}
              required={props.settings.Compulsory}
              fullWidth={true}
            />
          ) : (
            <DateTimePicker
              value={value}
              onChange={handleDateChange}
              label={props.settings.DisplayName}
              id={props.settings.Name}
              disabled={props.settings.ReadOnly}
              placeholder={props.settings.DisplayName}
              required={props.settings.Compulsory}
              fullWidth={true}
            />
          )}
        </MuiPickersUtilsProvider>
      )
    default:
      return props.fieldValue ? (
        <div>
          <label>{props.settings.DisplayName}</label>
          {props.settings.DateTimeMode === DateTimeMode.Date ? (
            <p>
              {moment(props.fieldValue)
                .format('LL')
                .toLocaleString()}
            </p>
          ) : (
            <p>{moment(props.fieldValue).toLocaleString()}</p>
          )}
        </div>
      ) : null
  }
}
