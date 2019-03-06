import TextField from '@material-ui/core/TextField'
import React from 'react'
import { InputProps } from 'react-autosuggest'

export const CommandPaletteInput: React.FunctionComponent<InputProps<{}>> = inputProps => {
  const { classes, ref, defaultValue, onChange, displayName, name, description, helperText, ...other } = inputProps

  return (
    <TextField
      type="text"
      label={displayName}
      placeholder={displayName}
      title={description}
      helperText={helperText}
      value={inputProps.value}
      onChange={ev => inputProps.onChange(ev, { method: 'type', newValue: ev.currentTarget.value })}
      {...other}
    />
  )
}
