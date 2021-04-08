/**
 * @module FieldControls
 */
import { deepMerge } from '@sensenet/client-utils'
import { ShortTextFieldSetting } from '@sensenet/default-content-types'
import { FormHelperText, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'
import { defaultLocalization } from './localization'

/**
 * Field control that represents a ShortText field. Available values will be populated from the FieldSettings.
 */
export const ShortText: React.FC<ReactClientFieldSetting<ShortTextFieldSetting>> = (props) => {
  const localization = deepMerge(defaultLocalization.shortText, props.localization?.shortText)

  const [value, setValue] = useState(
    props.fieldValue || (props.actionName === 'new' && changeTemplatedValue(props.settings.DefaultValue)) || '',
  )

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    setValue(e.target.value)
    props.fieldOnChange?.(props.settings.Name, e.target.value)
  }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <>
          <TextField
            autoFocus={props.autoFocus}
            autoComplete="off"
            name={props.settings.Name}
            id={props.settings.Name}
            label={props.settings.DisplayName}
            placeholder={props.settings.DisplayName}
            value={value}
            required={props.settings.Compulsory}
            disabled={props.settings.ReadOnly}
            inputProps={{
              minLength: props.settings.MinLength,
              maxLength: props.settings.MaxLength,
              pattern: props.settings.Regex,
            }}
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
            {props.fieldValue || localization.noValue}
          </Typography>
        </div>
      )
  }
}
