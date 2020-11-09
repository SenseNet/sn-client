/**
 * @module FieldControls
 */
import { deepMerge } from '@sensenet/client-utils'
import { ChoiceFieldSetting } from '@sensenet/default-content-types'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Typography from '@material-ui/core/Typography'
import React, { useState } from 'react'
import { ReactClientFieldSetting } from './client-field-setting'
import { defaultLocalization } from './localization'

/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 */
export const RadioButtonGroup: React.FC<ReactClientFieldSetting<ChoiceFieldSetting>> = (props) => {
  const localization = deepMerge(defaultLocalization.radioButtonGroup, props.localization?.radioButtonGroup)

  const getInitialState = () => {
    if (!props.fieldValue) {
      return ''
    }
    return Array.isArray(props.fieldValue) ? props.fieldValue[0] : props.fieldValue
  }
  const [value, setValue] = useState(getInitialState)

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
          <FormLabel style={{ transform: 'translate(0, 1.5px) scale(0.75)', transformOrigin: 'top left' }}>
            {props.settings.DisplayName}
          </FormLabel>
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
          <Typography variant="body1" gutterBottom>
            {value ? props.settings.Options?.find((item) => item.Value === value)?.Text ?? value : localization.noValue}
          </Typography>
        </>
      )
    }
  }
}
