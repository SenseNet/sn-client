import { TextField } from '@material-ui/core'
import React from 'react'
import { RenderInputComponentProps } from 'react-autosuggest'

type ReferenceFieldInputProps = {
  inputProps: RenderInputComponentProps
  displayName?: string
  helperText?: string
  description?: string
  autoFocus?: boolean
}
/**
 * Default Input field for Reference picker
 */
export const ReferenceFieldInput = (props: ReferenceFieldInputProps) => {
  const { description, displayName, helperText, inputProps } = props
  return (
    <TextField
      data-test={'reference-input'}
      autoFocus={props.autoFocus}
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
      onChange={(ev) => inputProps.onChange && inputProps.onChange(ev)}
    />
  )
}
