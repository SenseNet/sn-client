/**
 * @module FieldControls
 */
import MomentUtils from '@date-io/moment'
import { DateTimePicker, DatePicker as MUIDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import moment from 'moment'
import React, { useState } from 'react'
import { DateTimeFieldSetting, DateTimeMode } from '@sensenet/default-content-types'
import Typography from '@material-ui/core/Typography'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { changeJScriptValue } from '@sensenet/controls-react'
import { createStyles, InputLabel, makeStyles, Theme } from '@material-ui/core'
import { ReactClientFieldSetting } from './ClientFieldSetting'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    inputBase: {
      '& input': {
        height: '36px',
        boxSizing: 'border-box',
        borderRadius: 4,
        position: 'relative',
        backgroundColor: 'transparent',
        border:
          theme.palette.type === 'light' ? '1px solid rgba(	197, 197, 197, 0.87 )' : '1px solid rgba(		80, 80, 80, 0.87 )',
        padding: '10px 12px',
        transition: theme.transitions.create(['border-color']),
        '&:focus': {
          borderColor: theme.palette.primary.main,
        },
      },
    },
    formControl: {
      marginTop: '9px',
    },
  })
})
/**
 * Field control that represents a Date field. Available values will be populated from the FieldSettings.
 */
export const DatePicker: React.FC<ReactClientFieldSetting<DateTimeFieldSetting>> = props => {
  const initialState = props.fieldValue || changeJScriptValue(props.settings.DefaultValue) || moment().toISOString()
  const [value, setValue] = useState(initialState)
  const classes = useStyles()

  const handleDateChange = (date: MaterialUiPickersDate) => {
    if (!date) {
      return
    }
    setValue(moment.utc(date).toISOString())
    props.fieldOnChange && props.fieldOnChange(props.settings.Name, moment.utc(date).toISOString())
  }

  switch (props.actionName) {
    case 'new':
    case 'edit':
      return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
          {props.settings.DateTimeMode === DateTimeMode.Date ? (
            <>
              <InputLabel
                shrink
                htmlFor={props.settings.Name}
                required={props.settings.Compulsory}
                style={{ height: '16px' }}>
                {props.settings.DisplayName}
              </InputLabel>
              <MUIDatePicker
                value={value}
                onChange={handleDateChange}
                name={props.settings.Name}
                defaultValue={changeJScriptValue(props.settings.DefaultValue)}
                id={props.settings.Name}
                disabled={props.settings.ReadOnly}
                placeholder={props.settings.DisplayName}
                fullWidth={true}
                InputProps={{
                  className: classes.inputBase,
                }}
                inputVariant="outlined"
                className={classes.formControl}
              />
            </>
          ) : (
            <>
              <InputLabel
                shrink
                htmlFor={props.settings.Name}
                required={props.settings.Compulsory}
                style={{ height: '16px' }}>
                {props.settings.DisplayName}
              </InputLabel>
              <DateTimePicker
                value={value}
                onChange={handleDateChange}
                name={props.settings.Name}
                defaultValue={changeJScriptValue(props.settings.DefaultValue)}
                id={props.settings.Name}
                disabled={props.settings.ReadOnly}
                placeholder={props.settings.DisplayName}
                fullWidth={true}
                InputProps={{
                  className: classes.inputBase,
                }}
                inputVariant="outlined"
                className={classes.formControl}
              />
            </>
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
              {moment(props.fieldValue)
                .format('LL')
                .toLocaleString()}
            </Typography>
          ) : (
            <Typography variant="body1" gutterBottom={true}>
              {moment(props.fieldValue).toLocaleString()}
            </Typography>
          )}
        </div>
      ) : (
        <Typography variant="caption" gutterBottom={true}>
          {props.settings.DisplayName}
        </Typography>
      )
  }
}
