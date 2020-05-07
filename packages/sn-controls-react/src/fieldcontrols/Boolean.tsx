/**
 * @module FieldControls
 */
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import React, { useState } from 'react'
import { FieldSetting } from '@sensenet/default-content-types'
import { changeJScriptValue } from '../helpers'
import { ReactClientFieldSetting } from './ClientFieldSetting'
import { renderIconDefault } from './icon'

/**
 * Field control that represents a Boolean field.
 */
export const BooleanComponent: React.FC<ReactClientFieldSetting<FieldSetting>> = (props) => {
  const initialState = props.fieldValue != null ? !!props.fieldValue : !!changeJScriptValue(props.settings.DefaultValue)
  const [value, setValue] = useState(initialState)

  const handleChange = () => {
    setValue(!value)
    props.fieldOnChange && props.fieldOnChange(props.settings.Name, !value)
  }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <FormControl required={props.settings.Compulsory} disabled={props.settings.ReadOnly}>
          <FormControlLabel
            name={props.settings.Name}
            control={<Checkbox checked={value} onChange={handleChange} />}
            label={props.settings.DisplayName}
          />
          <FormHelperText>{props.settings.Description}</FormHelperText>
        </FormControl>
      )
    case 'browse':
    default:
      return props.fieldValue != null ? (
        <div style={{ display: 'flex' }}>
          <span>{props.settings.DisplayName}</span>
          {props.renderIcon
            ? props.renderIcon(props.fieldValue ? 'check' : 'not_interested')
            : renderIconDefault(props.fieldValue ? 'check' : 'not_interested')}
        </div>
      ) : null
  }
}
