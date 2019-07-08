/**
 * @module FieldControls
 */
import MomentUtils from '@date-io/moment'
import { MaterialUiPickersDate, MuiPickersUtilsProvider, TimePicker as MUITimePicker } from '@material-ui/pickers'
import moment from 'moment'
import React, { useState } from 'react'
import { DateTimeFieldSetting } from '@sensenet/default-content-types'
import Typography from '@material-ui/core/Typography'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Field control that represents a DateTime field. Available values will be populated from the FieldSettings.
 */
export function TimePicker(props: ReactClientFieldSetting<DateTimeFieldSetting>) {
  const initialState = props.fieldValue || props.settings.DefaultValue || moment().toISOString()
  const [value, setValue] = useState(initialState)

  const handleDateChange = (date: MaterialUiPickersDate) => {
    if (!date) {
      return
    }
    setValue(moment.utc(date).toString())
    props.fieldOnChange && props.fieldOnChange(props.settings.Name, moment.utc(date))
  }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
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
        </MuiPickersUtilsProvider>
      )
    case 'browse':
    default:
      return props.fieldValue ? (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            {moment(props.fieldValue).format('HH:mm:ss')}
          </Typography>
        </div>
      ) : null
  }
}
