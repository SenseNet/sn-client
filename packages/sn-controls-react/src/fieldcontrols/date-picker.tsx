/**
 * @module FieldControls
 */
import { deepMerge } from '@sensenet/client-utils'
import { DateTimeFieldSetting, DateTimeMode } from '@sensenet/default-content-types'
import FormHelperText from '@material-ui/core/FormHelperText'
import Typography from '@material-ui/core/Typography'
import { DateTimePicker, DatePicker as MUIDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import MomentUtils from '@date-io/moment'
import moment from 'moment'
import React, { useState } from 'react'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'
import { defaultLocalization } from './localization'

/**
 * Field control that represents a Date field. Available values will be populated from the FieldSettings.
 */
export const DatePicker: React.FC<ReactClientFieldSetting<DateTimeFieldSetting>> = (props) => {
  const localization = deepMerge(defaultLocalization.datePicker, props.localization?.datePicker)

  const initialState =
    props.fieldValue ||
    (props.actionName === 'new' &&
      changeTemplatedValue(props.settings.DefaultValue, props.settings.EvaluatedDefaultValue)) ||
    null
  const [value, setValue] = useState(initialState)

  const handleDateChange = (date: MaterialUiPickersDate) => {
    if (!date) {
      return
    }
    setValue(moment.utc(date).toISOString())
    props.fieldOnChange?.(props.settings.Name, moment.utc(date).toISOString())
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
              id={props.settings.Name}
              disabled={props.settings.ReadOnly}
              placeholder={props.settings.DisplayName}
              required={props.settings.Compulsory}
              fullWidth={true}
            />
          )}
          {!props.hideDescription && <FormHelperText>{props.settings.Description}</FormHelperText>}
        </MuiPickersUtilsProvider>
      )
    default:
      return (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            {props.fieldValue
              ? props.settings.DateTimeMode === DateTimeMode.Date
                ? moment(props.fieldValue).format('LL').toLocaleString()
                : moment(props.fieldValue).toLocaleString()
              : localization.noValue}
          </Typography>
        </div>
      )
  }
}
