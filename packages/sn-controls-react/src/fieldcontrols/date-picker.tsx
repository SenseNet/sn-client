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

const initialValueState = ({
  fieldValue,
  actionName,
  settings,
}: Pick<ReactClientFieldSetting<DateTimeFieldSetting>, 'fieldValue' | 'actionName' | 'settings'>) => {
  if (fieldValue === '0001-01-01T00:00:00Z') {
    return null
  }

  if (fieldValue) {
    return fieldValue
  }

  if (actionName !== 'new') {
    return null
  }

  const secureCheckedDateInput = changeTemplatedValue(settings.DefaultValue, settings.EvaluatedDefaultValue)

  return secureCheckedDateInput
}
/**
 * Field control that represents a Date field. Available values will be populated from the FieldSettings.
 */
export const DatePicker: React.FC<ReactClientFieldSetting<DateTimeFieldSetting>> = (props) => {
  const { settings, actionName, fieldValue, locale, localization, hideDescription, fieldOnChange } = props

  const localizationMerged = deepMerge(defaultLocalization.datePicker, localization?.datePicker)

  const [value, setValue] = useState(initialValueState({ fieldValue, actionName, settings }))

  const handleDateChange = (date: MaterialUiPickersDate) => {
    if (!date) {
      return
    }
    setValue(new Date(date).toISOString())
    fieldOnChange?.(settings.Name, new Date(date).toISOString())
  }

  switch (actionName) {
    case 'edit':
    case 'new':
      return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
          <>
            {settings.DateTimeMode === DateTimeMode.Date ? (
              <MUIDatePicker
                value={value}
                minDate={minDatePickerDate}
                onChange={handleDateChange}
                name={settings.Name}
                label={settings.DisplayName}
                id={settings.Name}
                disabled={settings.ReadOnly}
                placeholder={settings.DisplayName}
                required={settings.Compulsory}
                fullWidth={true}
                format="yyyy MMMM dd"
              />
            ) : (
              <DateTimePicker
                minDate={minDatePickerDate}
                value={value}
                onChange={handleDateChange}
                label={settings.DisplayName}
                name={settings.Name}
                id={settings.Name}
                disabled={settings.ReadOnly}
                placeholder={settings.DisplayName}
                required={settings.Compulsory}
                fullWidth={true}
                format="yyyy MMMM do hh:mm aaaa"
              />
            )}
            {!hideDescription && <FormHelperText>{settings.Description}</FormHelperText>}
          </>
        </MuiPickersUtilsProvider>
      )
    default:
      return (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {settings.DisplayName}
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            {fieldValue
              ? settings.DateTimeMode === DateTimeMode.Date
                ? format(new Date(fieldValue), 'PPP', { locale }).toLocaleString()
                : format(new Date(fieldValue), 'PPPppp', { locale }).toLocaleString()
              : localizationMerged.noValue}
          </Typography>
        </div>
      )
  }
}
