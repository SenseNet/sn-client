/**
 * @module FieldControls
 */
import { TextField, Typography } from '@material-ui/core'
import { deepMerge } from '@sensenet/client-utils'
import { ShortTextFieldSetting } from '@sensenet/default-content-types'
import React, { useState } from 'react'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'
import CustomLabel from './label/custom-label'
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
          <CustomLabel
            name={props.settings.Name}
            displayName={props.settings.DisplayName}
            highlighted={props.settings.Customization?.Highlighted}
            description={props.settings.Description}
            showDescription={!props.hideDescription}
          />
          <TextField
            variant="outlined"
            autoFocus={props.autoFocus}
            autoComplete="off"
            name={props.settings.Name}
            id={props.settings.Name}
            InputLabelProps={{ shrink: true }}
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
        </>
      )
    case 'browse':
    default:
      return (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {`${props.settings.DisplayName} (${props.settings.Name})`}
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            {/* Temporary hot fix */}
            {typeof props.fieldValue === 'object' && props.fieldValue !== null
              ? '[OBJECT]'
              : props.fieldValue || localization.noValue}
          </Typography>
        </div>
      )
  }
}
