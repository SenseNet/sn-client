/**
 * @module FieldControls
 */
import { deepMerge } from '@sensenet/client-utils'
import { DateTimeFieldSetting, DateTimeMode } from '@sensenet/default-content-types'
import { FormHelperText, Typography } from '@material-ui/core'
import { DateTimePicker, DatePicker as MUIDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import type { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import DateFnsUtils from '@date-io/date-fns'
import format from 'date-fns/format'
import React, { useState } from 'react'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'
import { defaultLocalization } from './localization'

const minDatePickerDate = new Date('0001-01-01')

const initialState = (fieldAttributes: ReactClientFieldSetting<DateTimeFieldSetting>) => {
  if (fieldAttributes.fieldValue === '0001-01-01T00:00:00Z') {
    return null
  }

  if (fieldAttributes.actionName !== 'new') {
    return null
  }

  const secureCheckedDateInput = changeTemplatedValue(
    fieldAttributes.settings.DefaultValue,
    fieldAttributes.settings.EvaluatedDefaultValue,
  )

  return secureCheckedDateInput
}

/**
 * Field control that represents a Date field. Available values will be populated from the FieldSettings.
 */
export const DatePicker: React.FC<ReactClientFieldSetting<DateTimeFieldSetting>> = (props) => {
  const localization = deepMerge(defaultLocalization.datePicker, props.localization?.datePicker)

  const [value, setValue] = useState(props.fieldValue || initialState(props))

  const handleDateChange = (date: MaterialUiPickersDate) => {
    if (!date) {
      return
    }
    setValue(new Date(date).toISOString())
    props.fieldOnChange?.(props.settings.Name, new Date(date).toISOString())
  }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={props.locale}>
          <>
            {props.settings.DateTimeMode === DateTimeMode.Date ? (
              <MUIDatePicker
                value={value}
                minDate={minDatePickerDate}
                onChange={handleDateChange}
                name={props.settings.Name}
                label={props.settings.DisplayName}
                id={props.settings.Name}
                disabled={props.settings.ReadOnly}
                placeholder={props.settings.DisplayName}
                required={props.settings.Compulsory}
                fullWidth={true}
                format="yyyy MMMM dd"
              />
            ) : (
              <DateTimePicker
                minDate={minDatePickerDate}
                value={value}
                onChange={handleDateChange}
                label={props.settings.DisplayName}
                name={props.settings.Name}
                id={props.settings.Name}
                disabled={props.settings.ReadOnly}
                placeholder={props.settings.DisplayName}
                required={props.settings.Compulsory}
                fullWidth={true}
                format="yyyy MMMM do hh:mm aaaa"
              />
            )}
            {!props.hideDescription && <FormHelperText>{props.settings.Description}</FormHelperText>}
          </>
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
                ? format(new Date(props.fieldValue), 'PPP', { locale: props.locale }).toLocaleString()
                : format(new Date(props.fieldValue), 'PPPppp', { locale: props.locale }).toLocaleString()
              : localization.noValue}
          </Typography>
        </div>
      )
  }
}
