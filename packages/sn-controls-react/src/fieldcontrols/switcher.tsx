/**
 * @module FieldControls
 */
import { deepMerge } from '@sensenet/client-utils'
import { FieldSetting } from '@sensenet/default-content-types'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import createStyles from '@material-ui/core/styles/createStyles'
import makeStyles from '@material-ui/core/styles/makeStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import MuiSwitch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import clsx from 'clsx'
import React, { useState } from 'react'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'
import { defaultLocalization } from './localization'

export const Switch = withStyles((theme: Theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'inline-flex',
  },
  sizeSmall: {
    width: 20,
    height: 10,

    '& $thumb': {
      width: 8,
      height: 8,
    },

    '& $switchBase': {
      padding: 1,

      '&$checked': {
        transform: 'translateX(10px)',
      },
    },
  },
  switchBase: {
    padding: 2,
    color: theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
    opacity: 1,
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.type === 'light' ? theme.palette.common.white : theme.palette.common.black,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
        borderColor: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none',
  },
  track: {
    opacity: 1,
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[700] : theme.palette.grey[200],
  },
  checked: {},
  disabled: {
    '&$checked': {
      color: theme.palette.grey[500],
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.grey[200],
        borderColor: theme.palette.grey[700],
      },
    },
  },
}))(MuiSwitch)

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
 * Field control that represents a Switcher field.
 */
export const Switcher: React.FC<ReactClientFieldSetting<FieldSetting>> = (props) => {
  const localization = deepMerge(defaultLocalization.switcher, props.localization?.switcher)

  const initialState =
    props.fieldValue == null && props.actionName === 'new'
      ? changeTemplatedValue(props.settings.DefaultValue)?.toLowerCase() === 'true'
      : !!props.fieldValue
  const [value, setValue] = useState(initialState)
  const classes = useStyles()

  const handleChange = () => {
    setValue(!value)
    props.fieldOnChange?.(props.settings.Name, !value)
  }

  switch (props.actionName) {
    case 'new':
    case 'edit':
      return (
        <FormControl
          className={clsx(classes.root, {
            [classes.alignedCenter]:
              props.settings.Name === 'Enabled' &&
              (props.repository?.schemas.isContentFromType(props.content, 'User') || props.actionName === 'new'),
          })}
          required={props.settings.Compulsory}
          disabled={props.settings.ReadOnly}>
          <Typography component="div">
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item style={{ paddingRight: '30px' }}>
                {props.settings.DisplayName}
              </Grid>
              <Grid item>
                <Switch size="small" checked={value} onChange={handleChange} />
              </Grid>
            </Grid>
          </Typography>
          {!props.hideDescription && <FormHelperText>{props.settings.Description}</FormHelperText>}
        </FormControl>
      )
    case 'browse':
    default:
      return (
        <Grid component={Typography} container alignItems="center" spacing={1}>
          <Grid item style={{ paddingRight: '30px' }}>
            {props.settings.DisplayName}
          </Grid>
          <Grid item>
            {props.fieldValue != null ? (
              <Switch size="small" checked={value} style={{ cursor: 'default', pointerEvents: 'none' }} />
            ) : (
              localization.noValue
            )}
          </Grid>
        </Grid>
      )
  }
}
