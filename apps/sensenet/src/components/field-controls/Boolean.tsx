/**
 * @module FieldControls
 */
import { changeJScriptValue } from '@sensenet/controls-react'
import { FieldSetting } from '@sensenet/default-content-types'
import React, { useState } from 'react'
import FormControl from '@material-ui/core/FormControl'
import { createStyles, Grid, makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { ReactClientFieldSetting } from './ClientFieldSetting'
import { Switcher } from './switcher'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    alignedCenter: {
      alignItems: 'center',
    },
  }),
)
/**
 * Field control that represents a Boolean field.
 */
export const BooleanComponent: React.FC<ReactClientFieldSetting<FieldSetting>> = (props) => {
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
        <FormControl
          className={clsx(classes.root, {
            [classes.alignedCenter]:
              props.settings.Name === 'Enabled' && (props.content?.Type === 'User' || props.actionName === 'new'),
          })}
          required={props.settings.Compulsory}
          disabled={props.settings.ReadOnly}>
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
        <FormControl
          className={clsx(classes.root, {
            [classes.alignedCenter]: props.content?.Type === 'User' && props.settings.Name === 'Enabled',
          })}
          required={props.settings.Compulsory}
          disabled={props.settings.ReadOnly}>
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
