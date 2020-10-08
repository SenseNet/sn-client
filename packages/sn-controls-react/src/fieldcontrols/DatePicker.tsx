/**
 * @module FieldControls
 */
import { DateTimeFieldSetting, DateTimeMode } from '@sensenet/default-content-types'
import Typography from '@material-ui/core/Typography'
import { DateTimePicker, DatePicker as MUIDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import MomentUtils from '@date-io/moment'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Field control that represents a Date field. Available values will be populated from the FieldSettings.
 */
export const DatePicker: React.FC<ReactClientFieldSetting<DateTimeFieldSetting>> = (props) => {
  const initialState =
    props.fieldValue ||
    changeTemplatedValue(props.settings.DefaultValue, props.settings.EvaluatedDefaultValue) ||
    moment().toISOString()
  const [value, setValue] = useState(initialState)

  useEffect(() => {
    setValue(initialState)
  }, [initialState])

  const handleDateChange = (date: MaterialUiPickersDate) => {
    if (!date) {
      return
    }
    setValue(moment.utc(date).toISOString())
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
              name={props.settings.Name}
              defaultValue={changeTemplatedValue(props.settings.DefaultValue, props.settings.EvaluatedDefaultValue)}
              label={props.settings.DisplayName}
              id={props.settings.Name}
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
              name={props.settings.Name}
              defaultValue={changeTemplatedValue(props.settings.DefaultValue, props.settings.EvaluatedDefaultValue)}
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
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          {props.settings.DateTimeMode === DateTimeMode.Date ? (
            <Typography variant="body1" gutterBottom={true}>
              {moment(props.fieldValue).format('LL').toLocaleString()}
            </Typography>
          ) : (
            <Typography variant="body1" gutterBottom={true}>
              {moment(props.fieldValue).toLocaleString()}
            </Typography>
          )}
        </div>
      ) : null
  }
}
