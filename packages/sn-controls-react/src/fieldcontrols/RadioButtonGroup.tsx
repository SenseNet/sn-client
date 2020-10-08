/**
 * @module FieldControls
 */
import { ChoiceFieldSetting } from '@sensenet/default-content-types'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import React, { useCallback, useEffect, useState } from 'react'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 */
export const RadioButtonGroup: React.FC<ReactClientFieldSetting<ChoiceFieldSetting>> = (props) => {
  const getInitialState = useCallback(() => {
    if (!props.fieldValue) {
      return ''
    }
    return Array.isArray(props.fieldValue) ? props.fieldValue[0] : props.fieldValue
  }, [props.fieldValue])

  const [value, setValue] = useState(getInitialState)

  useEffect(() => {
    setValue(getInitialState)
  }, [getInitialState])

  const handleChange = (_event: React.ChangeEvent<{}>, changedValue: string) => {
    setValue(changedValue)
    props.fieldOnChange?.(props.settings.Name, Array.isArray(changedValue) ? changedValue : [changedValue])
  }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <FormControl
          component={'fieldset' as 'div'}
          fullWidth={true}
          required={props.settings.Compulsory}
          disabled={props.settings.ReadOnly}>
          <FormLabel component={'legend' as 'label'}>{props.settings.DisplayName}</FormLabel>
          <RadioGroup
            aria-label={props.settings.DisplayName}
            name={props.settings.Name}
            value={value}
            onChange={handleChange}>
            {props.settings.Options &&
              props.settings.Options.map((option) => {
                return (
                  <FormControlLabel key={option.Value} value={option.Value} control={<Radio />} label={option.Text} />
                )
              })}
          </RadioGroup>
          <FormHelperText>{props.settings.Description}</FormHelperText>
        </FormControl>
      )
    case 'browse':
    default: {
      return value ? (
        <FormControl component={'fieldset' as 'div'}>
          <FormLabel component={'legend' as 'label'}>{props.settings.DisplayName}</FormLabel>
          <FormGroup>
            <FormControl component={'fieldset' as 'div'}>
              <FormControlLabel
                style={{ marginLeft: 0 }}
                label={
                  props.settings.Options ? props.settings.Options.find((item) => item.Value === value)!.Text : value
                }
                control={<span />}
              />
            </FormControl>
          </FormGroup>
        </FormControl>
      ) : null
    }
  }
}
