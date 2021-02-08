/**
 * @module FieldControls
 */

import { ReactClientFieldSetting } from '@sensenet/controls-react'
import { LongTextFieldSetting } from '@sensenet/default-content-types'
import { createStyles, makeStyles, TextField, Theme } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import React, { useState } from 'react'
import { useLocalization } from '../../hooks'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    linkStyle: {
      color: theme.palette.primary.main,
      cursor: 'pointer',
      textDecoration: 'underline',
    },
    input: {
      width: '45%',
    },
    rowContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
    },
    deleteIcon: {
      cursor: 'pointer',
      display: 'flex',
      alignSelf: 'center',
      margin: '6px',
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
          <div>
            <label>{localization.webhooksHeader.headers}</label>
          </div>
          {Object.keys(value).map((headerKey, _index) => {
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
                  value={value[headerKey]}
                  fullWidth={false}
                />
                <Delete
                  className={classes.deleteIcon}
                  onClick={() => {
                    const valueCopy = { ...value }
                    delete valueCopy[headerKey]
                    setValue(valueCopy)
                    props.fieldOnChange?.(props.settings.Name, JSON.stringify(valueCopy))
                  }}
                />
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
              placeholder={localization.webhooksHeader.valuPlaceHolder}
              value={actualValue}
              fullWidth={false}
              onChange={(event) => setActualValue(event.target.value)}
            />
          </div>
          <div
            className={classes.linkStyle}
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
            {localization.webhooksHeader.addCustomHeader}
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
          {Object.keys(value).map((headerKey, _index) => {
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
                  value={value[headerKey]}
                  fullWidth={false}
                />
              </div>
            )
          })}
        </>
      )
  }
}
