/**
 * @module FieldControls
 */
import { deepMerge } from '@sensenet/client-utils'
import { FieldSetting } from '@sensenet/default-content-types'
import MuiCheckbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import React, { useState } from 'react'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'
import { renderIconDefault } from './icon'
import { defaultLocalization } from './localization'

/**
 * Field control that represents a Checkbox field.
 */
export const Checkbox: React.FC<ReactClientFieldSetting<FieldSetting>> = (props) => {
  const localization = deepMerge(defaultLocalization.checkbox, props.localization?.checkbox)

  const initialState =
    props.fieldValue != null
      ? !!props.fieldValue
      : changeTemplatedValue(props.settings.DefaultValue)?.toLowerCase() === 'true'
  const [value, setValue] = useState(initialState)

  const handleChange = () => {
    setValue(!value)
    props.fieldOnChange?.(props.settings.Name, !value)
  }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <FormControl required={props.settings.Compulsory} disabled={props.settings.ReadOnly}>
          <FormControlLabel
            name={props.settings.Name}
            control={<MuiCheckbox checked={value} onChange={handleChange} />}
            label={props.settings.DisplayName}
          />
          {!props.hideDescription && <FormHelperText>{props.settings.Description}</FormHelperText>}
        </FormControl>
      )
    case 'browse':
    default:
      return (
        <div style={{ display: 'flex' }}>
          <span style={{ marginRight: '0.5rem' }}>{props.settings.DisplayName}</span>
          {props.fieldValue != null
            ? props.renderIcon
              ? props.renderIcon(props.fieldValue ? 'check' : 'not_interested')
              : renderIconDefault(props.fieldValue ? 'check' : 'not_interested')
            : localization.noValue}
        </div>
      )
  }
}
