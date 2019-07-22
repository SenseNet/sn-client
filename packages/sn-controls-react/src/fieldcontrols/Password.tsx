/**
 * @module FieldControls
 */
import React, { useState } from 'react'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import { renderIconDefault } from './icon'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Field control that represents a Password field. Available values will be populated from the FieldSettings.
 */
export const Password: React.FC<ReactClientFieldSetting> = props => {
  const [showPassword, setShowPassword] = useState(false)

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <FormControl>
          <InputLabel htmlFor={props.settings.Name}>{props.settings.DisplayName}</InputLabel>
          <Input
            type={showPassword ? 'text' : 'password'}
            name={props.settings.Name}
            id={props.settings.Name}
            placeholder={props.settings.DisplayName}
            required={props.settings.Compulsory}
            disabled={props.settings.ReadOnly}
            fullWidth={true}
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="Toggle password visibility" onClick={() => setShowPassword(!showPassword)}>
                  {props.renderIcon
                    ? props.renderIcon(showPassword ? 'visibility_off' : 'visibility')
                    : renderIconDefault(showPassword ? 'visibility_off' : 'visibility')}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText>{props.settings.Description}</FormHelperText>
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
