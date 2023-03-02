/**
 * @module FieldControls
 */
import { InputAdornment, TextField, Typography } from '@material-ui/core'
import { deepMerge } from '@sensenet/client-utils'
import React, { useState } from 'react'
import { changeTemplatedValue } from '../helpers'
import { defaultLocalization } from './localization'
import { ReactClientFieldSetting } from '.'

/**
 * Field control that represents a FileName field. Available values will be populated from the FieldSettings.
 */
export const FileName: React.FC<ReactClientFieldSetting> = (props) => {
  const localization = deepMerge(defaultLocalization.fileName, props.localization?.fileName)

  const valueInitialState =
    props.fieldValue
      ?.replace(/<[^>]*>/g, '')
      .split('.')
      .slice(0, -1)
      .join('.') ||
    (props.actionName === 'new' && changeTemplatedValue(props.settings.DefaultValue)) ||
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
    props.fieldOnChange?.(props.settings.Name, `${event.target.value}.${getExtension()}`)
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
          value={value}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <span>{`.${getExtension()}`}</span>
              </InputAdornment>
            ),
          }}
          required={props.settings.Compulsory}
          disabled={props.settings.ReadOnly}
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
