/**
 * @module FieldControls
 */
import React, { useState } from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for FileName state
 */
export interface FileNameState {
  value: string
  isValid: boolean
}
/**
 * Field control that represents a FileName field. Available values will be populated from the FieldSettings.
 */
export function FileName(props: ReactClientFieldSetting & { extension?: string }) {
  const valueInitialState =
    (props.content &&
      props.content[props.settings.Name]
        .replace(/<[^>]*>/g, '')
        .split('.')
        .slice(0, -1)
        .join('.')) ||
    props.settings.DefaultValue ||
    ''
  const [value, setValue] = useState(valueInitialState)

  const getExtension = () => {
    if (props.content && props.content[props.settings.Name] && props.content[props.settings.Name].indexOf('.') > -1) {
      return props.content[props.settings.Name].substr(props.content[props.settings.Name].lastIndexOf('.') + 1)
    }
    if (props.extension) {
      return props.extension
    }

    return ''
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const fileName = `${event.target.value}.${getExtension()}`
    setValue(fileName)
    props.fieldOnChange && props.fieldOnChange(props.settings.Name, fileName)
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
          defaultValue={props.settings.DefaultValue}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <span>{`.${getExtension()}`}</span>
              </InputAdornment>
            ),
          }}
          autoFocus={true}
          required={props.settings.Compulsory}
          disabled={props.settings.ReadOnly}
          fullWidth={true}
          helperText={props.settings.Description}
        />
      )
    case 'browse':
    default:
      return props.content && props.content[props.settings.Name] ? (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            {props.content[props.settings.Name]}
          </Typography>
        </div>
      ) : null
  }
}
