/**
 * @module FieldControls
 */
import { ShortTextFieldSetting } from '@sensenet/default-content-types'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import React, { useState } from 'react'
import { changeJScriptValue } from '../helpers'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Field control that represents a ShortText field. Available values will be populated from the FieldSettings.
 */
export const ShortText: React.FC<ReactClientFieldSetting<ShortTextFieldSetting>> = (props) => {
  const [value, setValue] = useState(props.fieldValue || changeJScriptValue(props.settings.DefaultValue) || '')

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    setValue(e.target.value)
    props.fieldOnChange && props.fieldOnChange(props.settings.Name, e.target.value)
  }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <TextField
          name={props.settings.Name}
          id={props.settings.Name}
          label={props.settings.DisplayName}
          placeholder={props.settings.DisplayName}
          value={value}
          required={props.settings.Compulsory}
          disabled={props.settings.ReadOnly}
          defaultValue={changeJScriptValue(props.settings.DefaultValue)}
          inputProps={{
            minLength: props.settings.MinLength,
            maxLength: props.settings.MaxLength,
            pattern: props.settings.Regex,
          }}
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
            {props.fieldValue}
          </Typography>
        </div>
      ) : null
  }
}
