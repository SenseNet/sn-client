/**
 * @module FieldControls
 */
import { createStyles, FormHelperText, makeStyles, Theme, Tooltip, Typography } from '@material-ui/core'
import { DateTimePicker, DatePicker as MUIDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import type { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { deepMerge } from '@sensenet/client-utils'
import { DateTimeFieldSetting, DateTimeMode } from '@sensenet/default-content-types'
import DateFnsUtils from '@date-io/date-fns'
import intlFormatDistance from 'date-fns/intlFormatDistance'
import React, { useState } from 'react'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'
import { defaultLocalization } from './localization'
const minDatePickerDate = new Date('0001-01-01')

export const dateTimeOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    textDate: {
      color: `hsl(174deg 3% ${theme.palette.type === 'light' ? '41' : '74'}%)`,
      fontSize: '0.66rem',
      letterSpacing: '0.5px',
      marginLeft: '5px',
      verticalAlign: 'middle',
    },
  })
})

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
  const classes = useStyles()

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

  const localeCode = locale?.code || window.navigator.language

  const dateFieldValue: Date = new Date(fieldValue as string)

  switch (actionName) {
    case 'edit':
    case 'new':
      return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
          <>
            {settings.DateTimeMode === DateTimeMode.Date ? (
              <MUIDatePicker
                style={{ display: 'inherit' }}
                value={value}
                minDate={minDatePickerDate}
                onChange={handleDateChange}
                name={settings.Name}
                label={settings.DisplayName}
                id={settings.Name}
                disabled={settings.ReadOnly}
                InputLabelProps={{ shrink: true }}
                required={settings.Compulsory}
                format="yyyy MMMM dd"
              />
            ) : (
              <DateTimePicker
                style={{ display: 'inherit' }}
                minDate={minDatePickerDate}
                value={value}
                onChange={handleDateChange}
                label={settings.DisplayName}
                name={settings.Name}
                id={settings.Name}
                disabled={settings.ReadOnly}
                InputLabelProps={{ shrink: true }}
                required={settings.Compulsory}
                format="yyyy MMMM dd hh:mm aaaa"
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
            {settings.DateTimeMode === DateTimeMode.DateAndTime && fieldValue && (
              <span className={classes.textDate}>
                {intlFormatDistance(dateFieldValue, new Date(), {
                  locale: localeCode,
                })}
              </span>
            )}
          </Typography>

          <Tooltip title={fieldValue as string}>
            <Typography variant="body1" gutterBottom={true}>
              {fieldValue
                ? settings.DateTimeMode === DateTimeMode.Date
                  ? new Intl.DateTimeFormat(localeCode).format(dateFieldValue)
                  : new Intl.DateTimeFormat(localeCode, dateTimeOptions).format(dateFieldValue)
                : localizationMerged.noValue}
            </Typography>
          </Tooltip>
        </div>
      )
  }
}
