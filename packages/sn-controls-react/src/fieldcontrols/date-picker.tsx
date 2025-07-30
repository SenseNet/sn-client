/**
 * @module FieldControls
 */
import { createStyles, FormHelperText, makeStyles, Theme, Tooltip, Typography } from '@material-ui/core'
import { deepMerge } from '@sensenet/client-utils'
import { DateTimeFieldSetting, DateTimeMode } from '@sensenet/default-content-types'
import intlFormatDistance from 'date-fns/intlFormatDistance'
import React, { useState } from 'react'
import DatePickerLib from 'react-datepicker'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'
import { defaultLocalization } from './localization'
import 'react-datepicker/dist/react-datepicker.css'

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

const disabledDateTimes: string[] = ['CreationDate', 'ModificationDate']

const initialValueState = ({
  fieldValue,
  actionName,
  settings,
}: Pick<ReactClientFieldSetting<DateTimeFieldSetting>, 'fieldValue' | 'actionName' | 'settings'>): Date | null => {
  if (fieldValue === '0001-01-01T00:00:00Z') return null

  if (fieldValue) {
    const parsed = new Date(fieldValue)
    return isNaN(parsed.getTime()) ? null : parsed
  }

  if (actionName !== 'new') return null

  const defaultVal = changeTemplatedValue(settings.DefaultValue, settings.EvaluatedDefaultValue)
  if (!defaultVal) return null

  const parsed = new Date(defaultVal)
  return isNaN(parsed.getTime()) ? null : parsed
}

/**
 * Field control that represents a Date field. Available values will be populated from the FieldSettings.
 */
export const DatePicker: React.FC<ReactClientFieldSetting<DateTimeFieldSetting>> = (props) => {
  const classes = useStyles()
  const { settings, actionName, fieldValue, locale, localization, hideDescription, fieldOnChange } = props
  const localizationMerged = deepMerge(defaultLocalization.datePicker, localization?.datePicker)
  const [value, setValue] = useState<Date | null>(initialValueState({ fieldValue, actionName, settings }))
  const localeCode = locale?.code || window.navigator.language
  const isDisabled = settings.ReadOnly || disabledDateTimes.includes(settings.Name)
  const dateFieldValue: Date = new Date(fieldValue as string)

  const handleDateChange = (date: Date | null) => {
    setValue(date)
    const isoString = date?.toISOString() ?? null
    fieldOnChange?.(settings.Name, isoString ?? '0001-01-01T00:00:00Z')
  }

  switch (actionName) {
    case 'edit':
    case 'new':
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor={props.settings.Name} style={{ fontSize: '15px' }}>
            <strong style={{ fontSize: '17px' }}>{props.settings.DisplayName}</strong> ({props.settings.Name})
          </label>
          <div style={{ maxWidth: '420px' }}>
            <DatePickerLib
              selected={value}
              onChange={handleDateChange}
              minDate={minDatePickerDate}
              showTimeSelect={settings.DateTimeMode === DateTimeMode.DateAndTime}
              dateFormat={settings.DateTimeMode === DateTimeMode.Date ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm'}
              timeFormat="HH:mm"
              timeIntervals={30}
              locale={locale}
              disabled={isDisabled}
              placeholderText="Select date"
              todayButton="Today"
              isClearable
            />
          </div>
          {!hideDescription && <FormHelperText>{settings.Description}</FormHelperText>}
        </div>
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
