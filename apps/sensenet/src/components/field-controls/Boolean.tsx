/**
 * @module FieldControls
 */
import { createStyles, Grid, makeStyles, Typography } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import { changeJScriptValue } from '@sensenet/controls-react'
import { FieldSetting } from '@sensenet/default-content-types'
import React, { useState } from 'react'
import { ReactClientFieldSetting } from './ClientFieldSetting'
import { Switcher } from './switcher'

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
    case 'new':
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
    case 'browse':
    default:
      return props.fieldValue != null ? (
        <FormControl className={classes.root} required={props.settings.Compulsory} disabled={props.settings.ReadOnly}>
          <Typography component="div">
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item style={{ paddingRight: '30px' }}>
                {props.settings.DisplayName}
              </Grid>
              <Grid item>
                <Switcher disabled checked={value} onChange={handleChange} />
              </Grid>
            </Grid>
          </Typography>
        </FormControl>
      ) : null
  }
}
