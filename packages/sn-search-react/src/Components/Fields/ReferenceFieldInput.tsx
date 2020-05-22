import React from 'react'
import { InputProps } from 'react-autosuggest'
import TextField from '@material-ui/core/TextField'

type ReferenceFieldInputProps = {
  inputProps: InputProps<{}>
  displayName?: string
  helperText?: string
  description?: string
}
/**
 * Default Input field for Reference picker
 */
export const ReferenceFieldInput = (props: ReferenceFieldInputProps) => {
  const { description, displayName, helperText, inputProps } = props
  return (
    <TextField
      type="text"
      label={displayName}
      placeholder={displayName}
      title={description}
      helperText={helperText}
      value={inputProps.value}
      InputProps={{
        ...(inputProps as any),
      }}
      onBlur={(ev) => inputProps.onBlur?.(ev)}
      onChange={(ev) => inputProps.onChange(ev, { method: 'type', newValue: ev.currentTarget.value })}
    />
  )
}
