/**
 * @module FieldControls
 */
import { FormControl, Checkbox as MuiCheckbox } from '@material-ui/core'
import { deepMerge } from '@sensenet/client-utils'
import { FieldSetting } from '@sensenet/default-content-types'
import React, { useState } from 'react'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'
import { renderIconDefault } from './icon'
import CustomLabel from './label/custom-label'
import { defaultLocalization } from './localization'

/**
 * Field control that represents a Checkbox field.
 */
export const Checkbox: React.FC<ReactClientFieldSetting<FieldSetting>> = (props) => {
  const localization = deepMerge(defaultLocalization.checkbox, props.localization?.checkbox)

  const initialState =
    props.fieldValue == null && props.actionName === 'new'
      ? changeTemplatedValue(props.settings.DefaultValue)?.toLowerCase() === 'true'
      : !!props.fieldValue
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
          <CustomLabel
            name={props.settings.Name}
            displayName={props.settings.DisplayName}
            highlighted={props.settings.Customization?.Highlighted}
            description={props.settings.Description}
            showDescription={!props.hideDescription}
          />
          <MuiCheckbox name={props.settings.Name} checked={value} onChange={handleChange} />
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
