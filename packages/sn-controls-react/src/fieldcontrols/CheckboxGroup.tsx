/**
 * @module FieldControls
 */
import React, { useState } from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import TextField from '@material-ui/core/TextField'
import { ChoiceFieldSetting } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 */
export function CheckboxGroup(props: ReactClientFieldSetting<ChoiceFieldSetting>) {
  const initialState =
    props.settings.Options &&
    props.settings.Options.map(item =>
      props.content && props.content[props.settings.Name].some((val: string) => val === item.Value)
        ? { ...item, Selected: true }
        : { ...item, Selected: false },
    )
  const [state, setState] = useState(initialState || [])

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = [...state]
    const index = newState.findIndex(item => item.Value === name)
    if (props.settings.AllowMultiple) {
      newState[index].Selected = event.target.checked
    } else {
      newState.forEach(item => (item.Selected = false))
      newState[index].Selected = event.target.checked
    }
    setState(newState)
    props.fieldOnChange && props.fieldOnChange(props.settings.Name, newState.map(item => item.Selected && item.Value))
  }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <FormControl
          disabled={props.settings.ReadOnly}
          component={'fieldset' as 'div'}
          required={props.settings.Compulsory}>
          <FormLabel component={'legend' as 'label'}>{props.settings.DisplayName}</FormLabel>
          <FormGroup>
            {state.map(option => {
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
      const value = props.content && props.content[props.settings.Name]
      return value ? (
        <FormControl component={'fieldset' as 'div'}>
          <FormLabel component={'legend' as 'label'}>{props.settings.DisplayName}</FormLabel>
          <FormGroup>
            {Array.isArray(value) ? (
              value.map((val: any, index: number) => (
                <FormControl component={'fieldset' as 'div'} key={index}>
                  <FormControlLabel
                    style={{ marginLeft: 0 }}
                    label={props.settings.Options!.find(item => item.Value === val)!.Text}
                    control={<span />}
                    key={val}
                  />
                </FormControl>
              ))
            ) : (
              <FormControl component={'fieldset' as 'div'}>
                <FormControlLabel
                  style={{ marginLeft: 0 }}
                  label={props.settings.Options!.find(item => item.Value === value)!.Text}
                  control={<span />}
                />
              </FormControl>
            )}
          </FormGroup>
        </FormControl>
      ) : null
    }
  }
}
