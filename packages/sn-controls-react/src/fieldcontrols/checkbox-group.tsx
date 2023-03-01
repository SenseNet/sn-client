/**
 * @module FieldControls
 */
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  TextField,
  Typography,
} from '@material-ui/core'
import { deepMerge } from '@sensenet/client-utils'
import { ChoiceFieldSetting } from '@sensenet/default-content-types'
import React, { useState } from 'react'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'
import { defaultLocalization } from './localization'

/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 */
export const CheckboxGroup: React.FC<ReactClientFieldSetting<ChoiceFieldSetting>> = (props) => {
  const localization = deepMerge(defaultLocalization.checkboxGroup, props.localization?.checkboxGroup)

  const getInitialstate = () => {
    if (!props.fieldValue) {
      if (props.actionName === 'new') {
        if (props.settings.DefaultValue) {
          const defaultValue = changeTemplatedValue(props.settings.DefaultValue)!.split(/,|;/)
          return props.settings.AllowMultiple ? defaultValue : defaultValue.slice(0, 1)
        }

        if (props.settings.Options?.length) {
          const selectedOnCtd = props.settings.Options.reduce<string[]>((selection, option) => {
            if (option.Selected) {
              selection.push(option.Value)
            }
            return selection
          }, [])
          const fieldValue = props.settings.AllowMultiple ? selectedOnCtd : selectedOnCtd.slice(0, 1)
          props.fieldOnChange?.(props.settings.Name, fieldValue)
          return fieldValue
        }
      }
      return ['']
    }
    if (!Array.isArray(props.fieldValue)) {
      return [props.fieldValue]
    }
    return props.fieldValue
  }

  const [value, setValue] = useState(getInitialstate)

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = props.settings.AllowMultiple
      ? event.target.checked
        ? [...value, name]
        : value.filter((item) => item !== name)
      : event.target.checked
      ? [name]
      : []

    setValue(newValue)
    props.fieldOnChange?.(props.settings.Name, newValue)
  }

  switch (props.actionName) {
    case 'new':
    case 'edit':
      return (
        <FormControl
          disabled={props.settings.ReadOnly}
          component={'fieldset' as 'div'}
          required={props.settings.Compulsory}>
          <FormLabel style={{ transform: 'translate(0, 1.5px) scale(0.75)', transformOrigin: 'top left' }}>
            {props.settings.DisplayName}
          </FormLabel>
          <FormGroup>
            {props.settings.Options?.map((option) => {
              return (
                <FormControlLabel
                  key={option.Value}
                  control={
                    <Checkbox
                      checked={value.includes(option.Value)}
                      onChange={handleChange(option.Value)}
                      value={option.Value}
                    />
                  }
                  label={option.Text}
                />
              )
            })}
          </FormGroup>
          {props.settings.AllowExtraValue ? <TextField placeholder="Extra value" /> : null}
          {!props.hideDescription && <FormHelperText>{props.settings.Description}</FormHelperText>}
        </FormControl>
      )
    case 'browse':
    default: {
      return (
        <>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <FormGroup>
            {props.fieldValue ? (
              Array.isArray(props.fieldValue) ? (
                props.fieldValue.length ? (
                  props.fieldValue.map((val: any, index: number) => (
                    <Typography variant="body1" gutterBottom={index === props.fieldValue!.length - 1} key={index}>
                      {props.settings.Options?.find((item) => item.Value === val)?.Text ?? ''}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body1" gutterBottom={true}>
                    {localization.noValue}
                  </Typography>
                )
              ) : (
                <Typography variant="body1" gutterBottom={true}>
                  {props.settings.Options?.find((item) => item.Value === (props.fieldValue as string))?.Text ?? ''}
                </Typography>
              )
            ) : (
              <Typography variant="body1" gutterBottom={true}>
                {localization.noValue}
              </Typography>
            )}
          </FormGroup>
        </>
      )
    }
  }
}
