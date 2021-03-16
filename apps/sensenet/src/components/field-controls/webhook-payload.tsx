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
import React, { useMemo, useState } from 'react'
import { useLocalization } from '../../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    textArea: {
      padding: '10px',
    },
  })
})

/**
 * Field control that represents a Webhook payload field.
 */
export const WebhookPayload: React.FC<ReactClientFieldSetting<LongTextFieldSetting>> = (props) => {
  const localization = useLocalization()
  const classes = useStyles()

  const initialState =
    '{"nodeId":1388,"versionId":401,"version":"V0.1.D","previousVersion":null,"versionModificationDate":"2021-02-25T12:16:58.78Z","modifiedBy":1,"path":"/Root/Content/DocLib/mydoc.docx","name":"mydoc.docx","displayName":"mydoc.docx","eventName":"Create","subscriptionId":1386,"sentTime":"2021-02-25T12:16:58.9472693Z"}'
  const [value] = useState(initialState)
  const [useDefault, setUseDefault] = useState<boolean>(true)

  const jsonValue = useMemo(() => JSON.stringify(JSON.parse(value), undefined, 4), [value])

  switch (props.actionName) {
    case 'edit':
    case 'new':
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
            value={jsonValue}
          />
        </>
      )
  }
}
