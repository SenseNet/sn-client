/**
 * @module FieldControls
 */
import {
  createStyles,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  makeStyles,
  Typography,
} from '@material-ui/core'
import { deepMerge } from '@sensenet/client-utils'
import React, { useState } from 'react'
import { ReactClientFieldSetting } from './client-field-setting'
import { renderIconDefault } from './icon'
import { defaultLocalization } from './localization'

const useStyles = makeStyles(() => {
  return createStyles({
    root: {
      '& input::-ms-reveal': {
        display: 'none',
      },
    },
  })
})

/**
 * Field control that represents a Password field. Available values will be populated from the FieldSettings.
 */
export const Password: React.FC<ReactClientFieldSetting> = (props) => {
  const localization = deepMerge(defaultLocalization.password, props.localization?.password)

  const [value, setValue] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const classes = useStyles()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    setValue(e.target.value)
    props.fieldOnChange?.(props.settings.Name, e.target.value)
  }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <FormControl fullWidth={true} className={classes.root}>
          <InputLabel htmlFor={props.settings.Name} shrink={true}>
            {props.settings.DisplayName}
          </InputLabel>
          <Input
            autoComplete="new-password"
            type={showPassword ? 'text' : 'password'}
            name={props.settings.Name}
            id={props.settings.Name}
            required={props.settings.Compulsory}
            disabled={props.settings.ReadOnly}
            onChange={handleChange}
            value={value}
            fullWidth={true}
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label={localization.toggleVisibility} onClick={() => setShowPassword(!showPassword)}>
                  {props.renderIcon
                    ? props.renderIcon(showPassword ? 'visibility_off' : 'visibility')
                    : renderIconDefault(showPassword ? 'visibility_off' : 'visibility')}
                </IconButton>
              </InputAdornment>
            }
          />
          {!props.hideDescription && <FormHelperText>{props.settings.Description}</FormHelperText>}
        </FormControl>
      )
    default:
      return (
        <Typography variant="caption" gutterBottom={true}>
          {props.settings.DisplayName}
        </Typography>
      )
  }
}
