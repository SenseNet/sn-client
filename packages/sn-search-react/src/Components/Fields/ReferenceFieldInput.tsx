import TextField from '@material-ui/core/TextField'
import React from 'react'
import { InputProps } from 'react-autosuggest'

/**
 * Default Input field for Reference picker
 * @param inputProps
 */
export const ReferenceFieldInput: React.FunctionComponent<InputProps<{}>> = inputProps => {
  const {
    classes,
    inputRef = () => {},
    ref,
    defaultValue,
    onChange,
    displayName,
    name,
    description,
    helperText,
    ...other
  } = inputProps

  return (
    <TextField
      type="text"
      label={displayName}
      placeholder={displayName}
      title={description}
      helperText={helperText}
      value={inputProps.value}
      InputProps={{
        inputRef: node => {
          ref(node)
          inputRef(node)
        },
      }}
      onChange={ev => inputProps.onChange(ev, { method: 'type', newValue: ev.currentTarget.value })}
      {...other}
    />
  )
}
