/**
 * @module FieldControls
 */
import { deepMerge } from '@sensenet/client-utils'
import { LongTextFieldSetting } from '@sensenet/default-content-types'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import React, { useState } from 'react'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'
import { defaultLocalization } from './localization'

/**
 * Field control that represents a LongText field. Available values will be populated from the FieldSettings.
 */
export const Textarea: React.FC<ReactClientFieldSetting<LongTextFieldSetting>> = (props) => {
  const localization = deepMerge(defaultLocalization.textarea, props.localization?.textarea)

  const initialState =
    props.fieldValue?.replace(/<[^>]*>/g, '') ||
    (props.actionName === 'new' && changeTemplatedValue(props.settings.DefaultValue)) ||
    ''
  const [value, setValue] = useState(initialState)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValue(event.target.value)
    props.fieldOnChange?.(props.settings.Name, event.target.value)
  }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <TextField
          autoFocus={props.autoFocus}
          onChange={handleChange}
          name={props.settings.Name}
          id={props.settings.Name}
          label={props.settings.DisplayName}
          placeholder={props.settings.DisplayName}
          value={value}
          required={props.settings.Compulsory}
          disabled={props.settings.ReadOnly}
          multiline={true}
          fullWidth={true}
          helperText={props.hideDescription ? undefined : props.settings.Description}
        />
      )
    case 'browse':
    default:
      return (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            {props.fieldValue || localization.noValue}
          </Typography>
        </div>
      )
  }
}
