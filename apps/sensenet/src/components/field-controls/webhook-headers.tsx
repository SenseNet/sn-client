/**
 * @module FieldControls
 */

import { ReactClientFieldSetting, renderIconDefault } from '@sensenet/controls-react'
import { LongTextFieldSetting } from '@sensenet/default-content-types'
import { createStyles, IconButton, InputLabel, makeStyles, TextField } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import React, { useState } from 'react'
import { useLocalization } from '../../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    input: {
      flexGrow: 1,
    },
    rowContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
    },
  })
})

/**
 * Field control that represents a Webhook header field.
 */
export const WebhookHeaders: React.FC<ReactClientFieldSetting<LongTextFieldSetting>> = (props) => {
  const classes = useStyles()
  const localization = useLocalization()

  const [value, setValue] = useState((props.fieldValue && JSON.parse(props.fieldValue)) || {})
  const [actualKey, setActualKey] = useState<string>()
  const [actualValue, setActualValue] = useState<string>()

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <>
          <InputLabel shrink>{localization.webhooksHeader.headers}</InputLabel>
          {Object.entries(value).map(([headerKey, headerValue], _index) => {
            return (
              <div key={headerKey} className={classes.rowContainer}>
                <TextField
                  disabled={true}
                  className={classes.input}
                  autoFocus={props.autoFocus}
                  autoComplete="off"
                  name={`${headerKey}-key`}
                  id={`${headerKey}-key`}
                  value={headerKey}
                  fullWidth={false}
                />
                <TextField
                  disabled={true}
                  style={{ marginLeft: '16px' }}
                  className={classes.input}
                  autoFocus={props.autoFocus}
                  autoComplete="off"
                  name={`${headerKey}-value`}
                  id={`${headerKey}-value`}
                  value={headerValue}
                  fullWidth={false}
                />
                <IconButton
                  onClick={() => {
                    const newValue = { ...value }
                    delete newValue[headerKey]
                    setValue(newValue)
                    props.fieldOnChange?.(props.settings.Name, JSON.stringify(newValue))
                  }}>
                  <Delete />
                </IconButton>
              </div>
            )
          })}

          <div className={classes.rowContainer}>
            <TextField
              className={classes.input}
              autoFocus={props.autoFocus}
              autoComplete="off"
              name={`${props.settings.Name}-key`}
              id={`${props.settings.Name}-key`}
              placeholder={localization.webhooksHeader.keyPlaceHolder}
              value={actualKey}
              fullWidth={false}
              onChange={(event) => setActualKey(event.target.value)}
            />
            <TextField
              style={{ marginLeft: '16px' }}
              className={classes.input}
              autoFocus={props.autoFocus}
              autoComplete="off"
              name={`${props.settings.Name}-value`}
              id={`${props.settings.Name}-value`}
              placeholder={localization.webhooksHeader.valuePlaceHolder}
              value={actualValue}
              fullWidth={false}
              onChange={(event) => setActualValue(event.target.value)}
            />
            <IconButton
              color="primary"
              onClick={() => {
                if (actualKey) {
                  const valueCopy = { ...value }
                  Object.assign(valueCopy, { [actualKey]: actualValue })
                  setValue(valueCopy)
                  props.fieldOnChange?.(props.settings.Name, JSON.stringify(valueCopy))
                  setActualKey('')
                  setActualValue('')
                }
              }}>
              {props.renderIcon ? props.renderIcon('add_circle') : renderIconDefault('add_circle')}
            </IconButton>
          </div>
        </>
      )
    case 'browse':
    default:
      return (
        <>
          <div>
            <label>{localization.webhooksHeader.headers}</label>
          </div>
          {Object.entries(value).map(([headerKey, headerValue], _index) => {
            return (
              <div key={headerKey} className={classes.rowContainer}>
                <TextField
                  disabled={true}
                  className={classes.input}
                  autoFocus={props.autoFocus}
                  autoComplete="off"
                  name={`${headerKey}-key`}
                  id={`${headerKey}-key`}
                  value={headerKey}
                  fullWidth={false}
                />
                <TextField
                  disabled={true}
                  style={{ marginLeft: '16px' }}
                  className={classes.input}
                  autoFocus={props.autoFocus}
                  autoComplete="off"
                  name={`${headerKey}-value`}
                  id={`${headerKey}-value`}
                  value={headerValue}
                  fullWidth={false}
                />
              </div>
            )
          })}
        </>
      )
  }
}
