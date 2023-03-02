/**
 * @module FieldControls
 */
import { FormControl, FormGroup, FormHelperText, InputLabel, MenuItem, Select, Typography } from '@material-ui/core'
import { deepMerge } from '@sensenet/client-utils'
import { ChoiceFieldSetting } from '@sensenet/default-content-types'
import React, { useState } from 'react'
import { changeTemplatedValue } from '../helpers'
import { defaultLocalization } from './localization'
import { ReactClientFieldSetting } from '.'

/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 */
export const DropDownList: React.FC<ReactClientFieldSetting<ChoiceFieldSetting>> = (props) => {
  const localization = deepMerge(defaultLocalization.dropdownList, props.localization?.dropdownList)

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

  const handleChange = (event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
    setValue(event.target.value as any)
    props.fieldOnChange?.(
      props.settings.Name,
      Array.isArray(event.target.value) ? event.target.value : [event.target.value],
    )
  }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <FormControl fullWidth={true} required={props.settings.Compulsory} disabled={props.settings.ReadOnly}>
          <InputLabel htmlFor={props.settings.Name}>{props.settings.DisplayName}</InputLabel>
          <Select
            onChange={handleChange}
            inputProps={
              {
                name: props.settings.Name,
                id: props.settings.Name,
              } as any
            }
            value={value}
            name={props.settings.Name}
            multiple={props.settings.AllowMultiple}
            autoWidth={true}
            fullWidth={true}>
            {props.settings.Options?.map((option) => {
              return (
                <MenuItem key={option.Value} value={option.Value} selected={option.Selected}>
                  {option.Text}
                </MenuItem>
              )
            })}
          </Select>
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
                  {props.settings.Options?.find((item) => item.Value === props.fieldValue)?.Text ?? ''}
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
