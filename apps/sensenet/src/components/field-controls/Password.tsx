/**
 * @module FieldControls
 */
import FormControl from '@material-ui/core/FormControl'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import React, { useState } from 'react'
import { ReactClientFieldSetting } from './ClientFieldSetting'
import { renderIconDefault } from './icon'

/**
 * Field control that represents a Password field. Available values will be populated from the FieldSettings.
 */
export const Password: React.FC<ReactClientFieldSetting> = props => {
  const [value, setValue] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    setValue(e.target.value)
    props.fieldOnChange?.(props.settings.Name, e.target.value)
  }
  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <FormControl style={{ width: '100%' }}>
          <InputLabel htmlFor={props.settings.Name}>{props.settings.DisplayName}</InputLabel>
          <Input
            type={showPassword ? 'text' : 'password'}
            name={props.settings.Name}
            id={props.settings.Name}
            placeholder={props.settings.DisplayName}
            required={props.settings.Compulsory}
            disabled={props.settings.ReadOnly}
            onChange={handleChange}
            value={value}
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
