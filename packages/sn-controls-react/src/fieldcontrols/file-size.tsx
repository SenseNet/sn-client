/**
 * @module FieldControls
 */
import { deepMerge, toNumber } from '@sensenet/client-utils'
import { NumberFieldSetting } from '@sensenet/default-content-types'
import { FormHelperText, InputAdornment, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { changeTemplatedValue, formatSize } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'
import { defaultLocalization } from './localization'

/**
 * Field control that represents a Number field. Available values will be populated from the FieldSettings.
 */
export const FileSizeField: React.FC<ReactClientFieldSetting<NumberFieldSetting>> = (props) => {
  const localization = deepMerge(defaultLocalization.fileSize, props.localization?.fileSize)

  const initialState =
    props.fieldValue != null
      ? props.fieldValue
      : (props.actionName === 'new' &&
          props.settings.DefaultValue !== undefined &&
          Number.parseInt(changeTemplatedValue(props.settings.DefaultValue)!, 10)) ||
        undefined
  const [value, setValue] = useState(initialState)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    setValue(e.target.value)
    props.fieldOnChange?.(props.settings.Name, e.target.value)
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

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <>
          <TextField
            autoFocus={props.autoFocus}
            name={props.settings.Name}
            type="number"
            label={props.settings.DisplayName}
            value={value}
            required={props.settings.Compulsory}
            disabled={props.settings.ReadOnly}
            placeholder={props.settings.DisplayName}
            InputProps={{
              endAdornment: <InputAdornment position="end">byte</InputAdornment>,
            }}
            inputProps={{
              step: defineStepValue(),
              max: props.settings.MaxValue,
              min: props.settings.MinValue,
            }}
            id={props.settings.Name}
            fullWidth={true}
            onChange={handleChange}
          />
          {!props.hideDescription && <FormHelperText>{props.settings.Description}</FormHelperText>}
        </>
      )
    case 'browse':
    default:
      return (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            {props.fieldValue && props.fieldValue !== '0' ? (
              <>{formatSize(toNumber(props.fieldValue)!, 0)}</>
            ) : (
              localization.noValue
            )}
          </Typography>
        </div>
      )
  }
}
