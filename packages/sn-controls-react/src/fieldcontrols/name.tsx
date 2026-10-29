/**
 * @module FieldControls
 */
import { TextField, Typography } from '@material-ui/core'
import { deepMerge } from '@sensenet/client-utils'
import React, { useState } from 'react'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'
import CustomLabel from './label/custom-label'
import { defaultLocalization } from './localization'

const invalidCharacters = ['%', '\\', '*', '~']
/**
 * Field control that represents a ShortText field. Available values will be populated from the FieldSettings.
 */
export const Name: React.FC<ReactClientFieldSetting> = (props) => {
  const localization = deepMerge(defaultLocalization.name, props.localization?.name)

  const initialState =
    (props.fieldValue && props.fieldValue.replace(/<[^>]*>/g, '')) ||
    (props.actionName === 'new' && changeTemplatedValue(props.settings.DefaultValue)) ||
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
    props.fieldOnChange?.(props.settings.Name, event.target.value)
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
            style={{ width: '100%' }}
            autoFocus={props.autoFocus}
            autoComplete="off"
            name={props.settings.Name}
            id={props.settings.Name}
            placeholder={props.settings.DisplayName}
            value={value}
            required={props.settings.Compulsory}
            disabled={props.settings.ReadOnly}
            fullWidth={true}
            onChange={handleChange}
            error={!isValid}
            helperText={!isValid && `${localization.invalidCharactersError} ${invalidCharacters.join(',')}`}
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
            {props.fieldValue || localization.noValue}
          </Typography>
        </div>
      )
  }
}
