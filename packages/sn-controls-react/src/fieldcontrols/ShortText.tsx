/**
 * @module FieldControls
 */
import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { TextFieldSetting } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Field control that represents a ShortText field. Available values will be populated from the FieldSettings.
 */
export function ShortText(props: ReactClientFieldSetting<TextFieldSetting>) {
  const [value, setValue] = useState(
    (props.content && props.content[props.settings.Name]) || props.settings.DefaultValue || '',
  )

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
          defaultValue={props.settings.DefaultValue}
          inputProps={{ minLength: props.settings.MinLength, maxLength: props.settings.MaxLength }}
          fullWidth={true}
          onChange={handleChange}
          helperText={props.settings.Description}
        />
      )
    case 'browse':
    default:
      return value ? (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            {value}
          </Typography>
        </div>
      ) : null
  }
}
