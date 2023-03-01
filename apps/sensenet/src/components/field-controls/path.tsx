/**
 * @module FieldControls
 */
import { createStyles, Input, InputAdornment, InputLabel, makeStyles } from '@material-ui/core'
import { changeTemplatedValue, ReactClientFieldSetting, renderIconDefault } from '@sensenet/controls-react'
import { ShortTextFieldSetting } from '@sensenet/default-content-types'
import React from 'react'

const useStyles = makeStyles(() => {
  return createStyles({
    input: {
      height: '36px',
      marginTop: '9px',
      '&::before': {
        border: 'none !important',
      },
    },
  })
})

/**
 * Field control that represents a ShortText field. Available values will be populated from the FieldSettings.
 */
export const Path: React.FC<ReactClientFieldSetting<ShortTextFieldSetting>> = (props) => {
  const classes = useStyles()

  return (
    <>
      <InputLabel shrink htmlFor={props.settings.Name} required={props.settings.Compulsory}>
        {props.settings.DisplayName}
      </InputLabel>
      <Input
        className={classes.input}
        name={props.settings.Name}
        id={props.settings.Name}
        placeholder={props.settings.DisplayName}
        required={props.settings.Compulsory}
        disabled
        value={props.fieldValue || changeTemplatedValue(props.settings.DefaultValue) || ''}
        defaultValue={changeTemplatedValue(props.settings.DefaultValue)}
        fullWidth={true}
        endAdornment={<InputAdornment position="end">{renderIconDefault('link')}</InputAdornment>}
      />
    </>
  )
}
