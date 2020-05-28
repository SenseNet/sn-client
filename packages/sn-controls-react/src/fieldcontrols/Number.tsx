/**
 * @module FieldControls
 */
import { toNumber } from '@sensenet/client-utils'
import { CurrencyFieldSetting, NumberFieldSetting } from '@sensenet/default-content-types'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import React, { useState } from 'react'
import { changeJScriptValue } from '../helpers'
import { ReactClientFieldSetting } from './ClientFieldSetting'
import { isCurrencyFieldSetting } from './type-guards'

/**
 * Field control that represents a Number field. Available values will be populated from the FieldSettings.
 */
export const NumberComponent: React.FC<ReactClientFieldSetting<NumberFieldSetting | CurrencyFieldSetting>> = (
  props,
) => {
  const initialState =
    props.fieldValue != null
      ? props.fieldValue
      : Number.parseInt(changeJScriptValue(props.settings.DefaultValue)!, 10) || ''
  const [value, setValue] = useState(initialState)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    setValue(e.target.value)
    props.fieldOnChange && props.fieldOnChange(props.settings.Name, e.target.value)
  }

  /**
   * Returns steps value by decimal and step settings
   */
  const defineStepValue = () => {
    if (props.settings.Step) {
      return props.settings.Step
    }
    if (!props.fieldValue) {
      return 1
    }
    return Number.isInteger(toNumber(props.fieldValue)!) || props.settings.Type === 'IntegerFieldSetting' ? 1 : 0.1
  }

  /**
   * Returns inputadornment by currency
   */
  const defineCurrency = () => {
    if (isCurrencyFieldSetting(props.settings) && props.settings.Format) {
      return <InputAdornment position="start">{props.settings.Format}</InputAdornment>
    }
    return null
  }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <TextField
          name={props.settings.Name}
          type="number"
          label={props.settings.DisplayName}
          value={value}
          required={props.settings.Compulsory}
          disabled={props.settings.ReadOnly}
          placeholder={props.settings.DisplayName}
          InputProps={{
            startAdornment: defineCurrency(),
            endAdornment: props.settings.ShowAsPercentage ? <InputAdornment position="end">%</InputAdornment> : null,
          }}
          inputProps={{
            step: defineStepValue(),
            max: props.settings.MaxValue,
            min: props.settings.MinValue,
          }}
          id={props.settings.Name}
          fullWidth={true}
          onChange={handleChange}
          helperText={props.settings.Description}
        />
      )
    case 'browse':
    default:
      return props.fieldValue ? (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            {isCurrencyFieldSetting(props.settings) ? (props.settings.Format ? props.settings.Format : '$') : null}
            {props.fieldValue}
            {props.settings.ShowAsPercentage ? '%' : null}
          </Typography>
        </div>
      ) : null
  }
}
