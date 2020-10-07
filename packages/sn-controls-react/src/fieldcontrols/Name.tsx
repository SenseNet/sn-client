/**
 * @module FieldControls
 */
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import React, { useState } from 'react'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './ClientFieldSetting'

const invalidCharacters = ['%', '\\', '*', '~']
/**
 * Field control that represents a ShortText field. Available values will be populated from the FieldSettings.
 */
export const Name: React.FC<ReactClientFieldSetting> = (props) => {
  const initialState =
    (props.fieldValue && props.fieldValue.replace(/<[^>]*>/g, '')) ||
    changeTemplatedValue(props.settings.DefaultValue) ||
    ''
  const [value, setValue] = useState(initialState)
  const [isValid, setIsValid] = useState(true)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setIsValid(true)
    setValue(event.target.value)
    if (invalidCharacters.some((c) => event.target.value.includes(c))) {
      setIsValid(false)
      return
    }
    props.fieldOnChange && props.fieldOnChange(props.settings.Name, event.target.value)
  }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <TextField
          autoFocus={props.autoFocus}
          name={props.settings.Name}
          id={props.settings.Name}
          label={props.settings.DisplayName}
          placeholder={props.settings.DisplayName}
          defaultValue={changeTemplatedValue(props.settings.DefaultValue)}
          value={value}
          required={props.settings.Compulsory}
          disabled={props.settings.ReadOnly}
          fullWidth={true}
          onChange={handleChange}
          error={!isValid}
          helperText={
            isValid
              ? props.settings.Description
              : `The Name field can't contain these characters: ${invalidCharacters.join(',')}`
          }
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
