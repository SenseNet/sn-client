/**
 * @module FieldControls
 */
import { ChoiceFieldSetting } from '@sensenet/default-content-types'
import { Typography } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import TextField from '@material-ui/core/TextField'
import React, { useState } from 'react'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 */
export const CheckboxGroup: React.FC<ReactClientFieldSetting<ChoiceFieldSetting>> = (props) => {
  const initialState =
    props.settings.Options &&
    props.settings.Options.map((item) =>
      props.fieldValue && Array.isArray(props.fieldValue)
        ? props.fieldValue.some((val: string) => val === item.Value)
          ? { ...item, Selected: true }
          : { ...item, Selected: false }
        : item.Value === props.fieldValue
        ? { ...item, Selected: true }
        : { ...item, Selected: false },
    )
  const [state, setState] = useState(initialState || [])

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = [...state]
    const index = newState.findIndex((item) => item.Value === name)
    if (props.settings.AllowMultiple) {
      newState[index].Selected = event.target.checked
    } else {
      newState.forEach((item) => (item.Selected = false))
      newState[index].Selected = event.target.checked
    }
    setState(newState)
    props.fieldOnChange?.(
      props.settings.Name,
      newState.filter((item) => item.Selected).map((item) => item.Value),
    )
  }

  switch (props.actionName) {
    case 'new':
    case 'edit':
      return (
        <FormControl
          disabled={props.settings.ReadOnly}
          component={'fieldset' as 'div'}
          required={props.settings.Compulsory}>
          <FormLabel component={'legend' as 'label'}>{props.settings.DisplayName}</FormLabel>
          <FormGroup>
            {state.map((option) => {
              return (
                <FormControlLabel
                  key={option.Value}
                  control={
                    <Checkbox checked={option.Selected} onChange={handleChange(option.Value)} value={option.Value} />
                  }
                  label={option.Text}
                />
              )
            })}
          </FormGroup>
          {props.settings.AllowExtraValue ? <TextField placeholder="Extra value" /> : null}
          <FormHelperText>{props.settings.Description}</FormHelperText>
        </FormControl>
      )
    case 'browse':
    default: {
      return props.fieldValue ? (
        <FormControl component={'fieldset' as 'div'}>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <FormGroup>
            {Array.isArray(props.fieldValue) ? (
              props.fieldValue.map((val: any, index: number) => (
                <FormControl component={'fieldset' as 'div'} key={index}>
                  <FormControlLabel
                    style={{ marginLeft: 0 }}
                    label={props.settings.Options!.find((item) => item.Value === val)!.Text}
                    control={<span />}
                    key={val}
                  />
                </FormControl>
              ))
            ) : (
              <FormControl component={'fieldset' as 'div'}>
                <FormControlLabel
                  style={{ marginLeft: 0 }}
                  label={props.settings.Options!.find((item) => item.Value === (props.fieldValue as string))!.Text}
                  control={<span />}
                />
              </FormControl>
            )}
          </FormGroup>
        </FormControl>
      ) : (
        <FormLabel component={'legend' as 'label'}>{props.settings.DisplayName}</FormLabel>
      )
    }
  }
}
