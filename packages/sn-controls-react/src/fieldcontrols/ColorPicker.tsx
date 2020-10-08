/**
 * @module FieldControls
 */
import { ColorFieldSetting } from '@sensenet/default-content-types'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import FormControl from '@material-ui/core/FormControl'
import Icon from '@material-ui/core/Icon'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import React, { useEffect, useState } from 'react'
import { ColorResult, SketchPicker } from 'react-color'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './ClientFieldSetting'

const style = {
  input: {
    width: 80,
  },
  pickerContainer: {
    position: 'absolute',
    left: '24px',
    top: '20px',
  } as React.CSSProperties,
}

const renderIconDefault = (name: string, color: string) => {
  return <Icon style={{ color }}>{name}</Icon>
}

/**
 * Field control that represents a Color field. Available values will be populated from the FieldSettings.
 */
export const ColorPicker: React.FC<ReactClientFieldSetting<ColorFieldSetting>> = (props) => {
  const [value, setValue] = useState(props.fieldValue || changeTemplatedValue(props.settings.DefaultValue) || '')
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  useEffect(() => {
    setValue(props.fieldValue || changeTemplatedValue(props.settings.DefaultValue) || '')
  }, [props.fieldValue, props.settings.DefaultValue])

  const handleChange = (color: ColorResult) => {
    props.fieldOnChange && props.fieldOnChange(props.settings.Name, color.hex)
    setValue(color.hex)
  }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <FormControl>
          <TextField
            label={props.settings.DisplayName}
            type="text"
            name={props.settings.Name}
            id={props.settings.Name}
            placeholder={props.settings.DisplayName}
            defaultValue={props.settings.DefaultValue}
            required={props.settings.Compulsory}
            disabled={props.settings.ReadOnly}
            value={value}
            onClick={() => setIsPickerOpen(true)}
            helperText={props.settings.Description}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {props.renderIcon ? props.renderIcon('lens') : renderIconDefault('lens', value)}
                </InputAdornment>
              ),
            }}
          />
          {isPickerOpen ? (
            <ClickAwayListener onClickAway={() => setIsPickerOpen(false)}>
              <div style={style.pickerContainer}>
                <SketchPicker
                  color={value}
                  onChangeComplete={handleChange}
                  onSwatchHover={handleChange}
                  disableAlpha={true}
                />
              </div>
            </ClickAwayListener>
          ) : null}
        </FormControl>
      )
    case 'browse':
    default:
      return props.fieldValue ? (
        <FormControl>
          <TextField
            type="text"
            name={props.settings.Name}
            id={props.settings.Name}
            label={props.settings.DisplayName}
            disabled={true}
            value={value}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {props.renderIcon ? props.renderIcon('lens') : renderIconDefault('lens', value)}
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      ) : null
  }
}
