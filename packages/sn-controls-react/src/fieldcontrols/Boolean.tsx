/**
 * @module FieldControls
 */
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import React, { useState } from 'react'
import { FieldSetting } from '@sensenet/default-content-types'
import { createStyles, Grid, makeStyles, Typography } from '@material-ui/core'
import { changeJScriptValue } from '../helpers'
import { Switcher } from './switcher'
import { ReactClientFieldSetting } from './ClientFieldSetting'
import { renderIconDefault } from './icon'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
)
/**
 * Field control that represents a Boolean field.
 */
export const BooleanComponent: React.FC<ReactClientFieldSetting<FieldSetting>> = props => {
  const initialState = props.fieldValue != null ? !!props.fieldValue : !!changeJScriptValue(props.settings.DefaultValue)
  const [value, setValue] = useState(initialState)
  const classes = useStyles()

  const handleChange = () => {
    setValue(!value)
    props.fieldOnChange && props.fieldOnChange(props.settings.Name, !value)
  }

  switch (props.actionName) {
    case 'edit':
      return (
        <FormControl className={classes.root} required={props.settings.Compulsory} disabled={props.settings.ReadOnly}>
          <Typography component="div">
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item style={{ paddingRight: '30px' }}>
                {props.settings.DisplayName}
              </Grid>
              <Grid item>
                <Switcher checked={value} onChange={handleChange} />
              </Grid>
            </Grid>
          </Typography>
        </FormControl>
      )
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
