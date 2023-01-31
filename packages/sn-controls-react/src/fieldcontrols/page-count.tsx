/**
 * @module FieldControls
 */
import { deepMerge } from '@sensenet/client-utils'
import { FormHelperText, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'
import { defaultLocalization, PageCountKey } from './localization'

/**
 * Field control that represents a PageCount field. Available values will be populated from the FieldSettings.
 */
export const PageCount: React.FC<ReactClientFieldSetting> = (props) => {
  const localization = deepMerge(defaultLocalization.pageCount, props.localization?.pageCount)

  const initialState =
    props.fieldValue || (props.actionName === 'new' && changeTemplatedValue(props.settings.DefaultValue)) || null
  const [value, setValue] = useState(initialState)

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
            name={props.settings.Name}
            type="number"
            label={props.settings.DisplayName}
            value={value}
            required={props.settings.Compulsory}
            disabled={props.settings.ReadOnly}
            placeholder={props.settings.DisplayName}
            id={props.settings.Name}
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
            {props.fieldValue != null ? (
              <>{+props.fieldValue < 0 ? localization[props.fieldValue as PageCountKey] : props.fieldValue}</>
            ) : (
              localization.noValue
            )}
          </Typography>
        </div>
      )
  }
}
