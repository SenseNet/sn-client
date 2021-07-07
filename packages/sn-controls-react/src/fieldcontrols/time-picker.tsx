/**
 * @module FieldControls
 */
import { deepMerge } from '@sensenet/client-utils'
import { DateTimeFieldSetting } from '@sensenet/default-content-types'
import { FormHelperText, Typography } from '@material-ui/core'
import { MuiPickersUtilsProvider, TimePicker as MUITimePicker } from '@material-ui/pickers'
import type { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import DateFnsUtils from '@date-io/date-fns'
import format from 'date-fns/format'
import React, { useState } from 'react'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'
import { defaultLocalization } from './localization'

/**
 * Field control that represents a DateTime field. Available values will be populated from the FieldSettings.
 */
export const TimePicker: React.FC<ReactClientFieldSetting<DateTimeFieldSetting>> = (props) => {
  const localization = deepMerge(defaultLocalization.timePicker, props.localization?.timePicker)

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
    setValue(new Date(date).toISOString())
    props.fieldOnChange?.(props.settings.Name, new Date(date).toISOString())
  }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={props.locale}>
          <MUITimePicker
            value={value}
            name={props.settings.Name}
            onChange={handleDateChange}
            label={props.settings.DisplayName}
            id={props.settings.Name}
            disabled={props.settings.ReadOnly}
            placeholder={props.settings.DisplayName}
            required={props.settings.Compulsory}
            fullWidth={true}
          />
          {!props.hideDescription && <FormHelperText>{props.settings.Description}</FormHelperText>}
        </MuiPickersUtilsProvider>
      )
    case 'browse':
    default:
      return (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            {props.fieldValue
              ? format(new Date(props.fieldValue), 'HH:mm:ss', { locale: props.locale })
              : localization.noValue}
          </Typography>
        </div>
      )
  }
}
