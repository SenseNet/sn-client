/**
 * @module FieldControls
 */
import { changeTemplatedValue } from '@sensenet/controls-react'
import { DateTimeFieldSetting } from '@sensenet/default-content-types'
import Typography from '@material-ui/core/Typography'
import { MuiPickersUtilsProvider, TimePicker as MUITimePicker } from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import MomentUtils from '@date-io/moment'
import moment from 'moment'
import React, { useState } from 'react'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Field control that represents a DateTime field. Available values will be populated from the FieldSettings.
 */
export const TimePicker: React.FC<ReactClientFieldSetting<DateTimeFieldSetting>> = (props) => {
  const initialState =
    props.fieldValue ||
    changeTemplatedValue(props.settings.DefaultValue, props.settings.EvaluatedDefaultValue) ||
    moment().toISOString()
  const [value, setValue] = useState(initialState)

  const handleDateChange = (date: MaterialUiPickersDate) => {
    if (!date) {
      return
    }
    setValue(moment.utc(date).toString())
    props.fieldOnChange && props.fieldOnChange(props.settings.Name, moment.utc(date))
  }

  switch (props.actionName) {
    case 'new':
    case 'edit':
      return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <MUITimePicker
            value={value}
            name={props.settings.Name}
            defaultValue={changeTemplatedValue(props.settings.DefaultValue, props.settings.EvaluatedDefaultValue)}
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
      ) : (
        <Typography variant="caption" gutterBottom={true}>
          {props.settings.DisplayName}
        </Typography>
      )
  }
}
