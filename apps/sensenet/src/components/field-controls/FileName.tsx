/**
 * @module FieldControls
 */
import { changeTemplatedValue } from '@sensenet/controls-react'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import React, { useState } from 'react'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Field control that represents a FileName field. Available values will be populated from the FieldSettings.
 */
export const FileName: React.FC<ReactClientFieldSetting> = (props) => {
  const valueInitialState =
    (props.fieldValue &&
      props.fieldValue
        .replace(/<[^>]*>/g, '')
        .split('.')
        .slice(0, -1)
        .join('.')) ||
    changeTemplatedValue(props.settings.DefaultValue) ||
    ''
  const [value, setValue] = useState(valueInitialState)

  const getExtension = () => {
    if (props.fieldValue && props.fieldValue.indexOf('.') > -1) {
      return props.fieldValue.substr(props.fieldValue.lastIndexOf('.') + 1)
    }
    if (props.extension) {
      return props.extension
    }

    return ''
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValue(event.target.value)
    props.fieldOnChange && props.fieldOnChange(props.settings.Name, `${event.target.value}.${getExtension()}`)
  }

  switch (props.actionName) {
    case 'new':
    case 'edit':
      return (
        <TextField
          name={props.settings.Name}
          id={props.settings.Name}
          label={props.settings.DisplayName}
          placeholder={props.settings.DisplayName}
          value={value}
          defaultValue={changeTemplatedValue(props.settings.DefaultValue)}
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
      return props.fieldValue ? (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            {props.fieldValue}
          </Typography>
        </div>
      ) : (
        <Typography variant="caption" gutterBottom={true}>
          {props.settings.DisplayName}
        </Typography>
      )
  }
}
