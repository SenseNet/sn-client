/**
 * @module FieldControls
 */
import { ChoiceFieldSetting } from '@sensenet/default-content-types'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Typography from '@material-ui/core/Typography'
import React, { useState } from 'react'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 */
export const RadioButtonGroup: React.FC<ReactClientFieldSetting<ChoiceFieldSetting>> = (props) => {
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
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
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
            {value ? props.settings.Options?.find((item) => item.Value === value)?.Text ?? value : 'No value set'}
          </Typography>
        </>
      )
    }
  }
}
