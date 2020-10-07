/**
 * @module FieldControls
 */
import { changeTemplatedValue } from '@sensenet/controls-react'
import { LongTextFieldSetting } from '@sensenet/default-content-types'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import React, { useState } from 'react'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Field control that represents a LongText field. Available values will be populated from the FieldSettings.
 */
export const Textarea: React.FC<ReactClientFieldSetting<LongTextFieldSetting>> = (props) => {
  const initialState =
    (props.fieldValue && props.fieldValue.replace(/<[^>]*>/g, '')) ||
    changeTemplatedValue(props.settings.DefaultValue) ||
    ''
  const [value, setValue] = useState(initialState)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValue(event.target.value)
    props.fieldOnChange && props.fieldOnChange(props.settings.Name, event.target.value)
  }

  switch (props.actionName) {
    case 'new':
    case 'edit':
      return (
        <TextField
          autoFocus={props.autoFocus}
          onChange={handleChange}
          name={props.settings.Name}
          id={props.settings.Name}
          label={props.settings.DisplayName}
          defaultValue={changeTemplatedValue(props.settings.DefaultValue)}
          placeholder={props.settings.DisplayName}
          value={value}
          required={props.settings.Compulsory}
          disabled={props.settings.ReadOnly}
          multiline={true}
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
