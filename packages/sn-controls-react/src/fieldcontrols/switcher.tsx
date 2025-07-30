/**
 * @module FieldControls
 */
import {
  createStyles,
  FormControl,
  FormHelperText,
  Grid,
  makeStyles,
  Switch as MuiSwitch,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core'
import { deepMerge } from '@sensenet/client-utils'
import { FieldSetting } from '@sensenet/default-content-types'
import { clsx } from 'clsx'
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
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
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

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
      alignItems: 'flex-start',
    },
    alignedCenter: {
      alignItems: 'flex-start',
    },
    switcherCont: {
      padding: '1.5px 4px',
      maxWidth: '420px',
      display: 'flex',
      justifyContent: 'space-between',
      border: theme.palette.type === 'light' ? '1px solid #DBDBDB' : '1px solid #2c2c2c',
      borderRadius: '4px 4px 0 0',
      marginLeft: '0',
      '&:hover': {
        cursor: 'pointer',
        border: '1px solid #666',
      },
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
              props.repository?.schemas.isContentFromType(props.content, 'User') ||
              props.repository?.schemas.isContentFromType(props.content, 'WebHookSubscription') ||
              props.actionName === 'new',
          })}
          required={props.settings.Compulsory}
          disabled={props.settings.ReadOnly}>
          <Typography component="div" style={{ width: '100%' }}>
            <Grid component="label" className={classes.switcherCont} container spacing={1}>
              <Grid item>
                <strong style={{ fontSize: '17px' }}>{props.settings.DisplayName}</strong> ({props.settings.Name})
              </Grid>
              <Grid item>
                <Switch data-test="edit-switch" size="medium" checked={value} onChange={handleChange} />
              </Grid>
            </Grid>
          </Typography>
          {!props.hideDescription && <FormHelperText>{props.settings.Description}</FormHelperText>}
        </FormControl>
      )
    case 'browse':
    default:
      return (
        <Grid
          component={Typography}
          container
          alignItems="center"
          spacing={1}
          className={clsx(classes.root, {
            [classes.alignedCenter]:
              props.repository?.schemas.isContentFromType(props.content, 'User') ||
              props.repository?.schemas.isContentFromType(props.content, 'WebHookSubscription'),
          })}>
          <Grid
            item
            style={{
              paddingRight: '30px',
            }}>
            {`${props.settings.DisplayName} (${props.settings.Name})`}
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
