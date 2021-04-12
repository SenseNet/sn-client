import { ReactClientFieldSetting } from '@sensenet/controls-react'
import { LongTextFieldSetting } from '@sensenet/default-content-types'
import {
  createStyles,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
  TextareaAutosize,
} from '@material-ui/core'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useLocalization } from '../../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    textArea: {
      padding: '10px',
    },
    example: {
      marginTop: '10px',
    },
    italic: {
      fontStyle: 'italic',
    },
  })
})

/**
 * Field control that represents a Webhook payload field.
 */
export const WebhookPayload: React.FC<ReactClientFieldSetting<LongTextFieldSetting>> = (props) => {
  const localization = useLocalization()
  const classes = useStyles()

  const initValue =
    (props.fieldValue === undefined || props.fieldValue === '') && props.actionName === 'new'
      ? props.settings.DefaultValue
      : props.fieldValue
  const [value, setValue] = useState(initValue)
  const [useDefault, setUseDefault] = useState<boolean>(value === undefined || value === '' || value === null)

  const exampleJSON =
    '{"nodeId":1388,"versionId":401,"version":"V0.1.D","previousVersion":null,"versionModificationDate":"2021-02-25T12:16:58.78Z","modifiedBy":1,"path":"/Root/Content/DocLib/mydoc.docx","name":"mydoc.docx","displayName":"mydoc.docx","eventName":"Create","subscriptionId":1386,"sentTime":"2021-02-25T12:16:58.9472693Z"}'

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <>
          <FormLabel style={{ transform: 'translate(0, 1.5px) scale(0.75)', transformOrigin: 'top left' }}>
            {localization.webhooksPayload.payload}
          </FormLabel>
          <RadioGroup
            aria-label="payload"
            name="payload"
            value={String(useDefault)}
            onChange={(event) => {
              setUseDefault(event.target.value === 'true')
              if (event.target.value === 'true') {
                setValue('')
                props.fieldOnChange?.(props.settings.Name, '')
              } else {
                setValue(initValue)
                props.fieldOnChange?.(props.settings.Name, initValue)
              }
            }}>
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label={localization.webhooksPayload.useDefault}
            />
            <FormControlLabel
              value="false"
              control={<Radio color="primary" />}
              label={localization.webhooksPayload.customize}
            />
          </RadioGroup>
          <TextareaAutosize
            disabled={useDefault}
            className={classes.textArea}
            aria-label="minimum height"
            rowsMin={10}
            cols={70}
            value={value}
            onChange={(ev) => {
              setValue(ev.target.value)
              props.fieldOnChange?.(props.settings.Name, ev.target.value)
            }}
          />
          <div className={clsx(classes.example, classes.italic)}>{localization.webhooksPayload.exampleDescription}</div>
          <div className={classes.italic}>{localization.webhooksPayload.example}</div>
          <pre className={classes.italic} id="json">
            {JSON.stringify(JSON.parse(exampleJSON), undefined, 4)}
          </pre>
        </>
      )
    case 'browse':
    default:
      return (
        <>
          <FormLabel style={{ transform: 'translate(0, 1.5px) scale(0.75)', transformOrigin: 'top left' }}>
            {localization.webhooksPayload.payload}
          </FormLabel>
          <RadioGroup
            aria-label="payload"
            name="payload"
            value={String(useDefault)}
            onChange={(event) => setUseDefault(event.target.value === 'true')}>
            <FormControlLabel
              disabled
              value="true"
              control={<Radio color="primary" />}
              label={localization.webhooksPayload.useDefault}
            />
            <FormControlLabel
              disabled
              value="false"
              control={<Radio color="primary" />}
              label={localization.webhooksPayload.customize}
            />
          </RadioGroup>
          <TextareaAutosize
            className={classes.textArea}
            disabled
            aria-label="minimum height"
            rowsMin={10}
            cols={70}
            value={value}
          />
        </>
      )
  }
}
