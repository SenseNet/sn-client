import { WebhookSubscription } from '@sensenet/default-content-types'
import { Button, DialogActions, DialogContent } from '@material-ui/core'
import React from 'react'
import { useGlobalStyles } from '../../../globalStyles'
import { useLocalization } from '../../../hooks'
import { useDialog } from '../dialog-provider'
import { DialogTitle } from '../dialog-title'
import { CollapsibleTable } from './collapsible-table'

const exampleData = {
  data: [
    {
      Url: 'https://test.com',
      RequestTime: '2021-06-07T12:00:00Z',
      ResponseTime: '2021-06-07T12:02:00Z',
      RequestLength: 300,
      ResponseLength: 340,
      ResponseStatusCode: 200,
      WebhookId: 1,
      ContentId: 2033,
      EventName: 'test',
      ErrorMessage: null,
    },
    {
      Url: 'https://test.com',
      RequestTime: '2021-06-08T12:00:00Z',
      ResponseTime: '2021-06-08T12:02:00Z',
      RequestLength: 200,
      ResponseLength: 212,
      ResponseStatusCode: 200,
      WebhookId: 1,
      ContentId: 2033,
      EventName: 'test',
      ErrorMessage: null,
    },
    {
      Url: 'https://test.com',
      RequestTime: '2021-06-09T14:00:00Z',
      ResponseTime: '2021-06-09T14:02:00Z',
      RequestLength: 300,
      ResponseLength: 312,
      ResponseStatusCode: 400,
      WebhookId: 1,
      ContentId: 2033,
      EventName: 'test',
      ErrorMessage: 'Bad request',
    },
    {
      Url: 'https://test.com',
      RequestTime: '2021-06-02T14:00:00Z',
      ResponseTime: '2021-06-02T14:02:00Z',
      RequestLength: 330,
      ResponseLength: 222,
      ResponseStatusCode: 304,
      WebhookId: 1,
      ContentId: 2033,
      EventName: 'test',
      ErrorMessage: 'Not modified',
    },
  ],
}

export type WebhookLogDialogProps = {
  content: WebhookSubscription
}

export const WebhookLogDialog: React.FunctionComponent<WebhookLogDialogProps> = (props) => {
  const { closeLastDialog } = useDialog()
  const globalClasses = useGlobalStyles()
  const localization = useLocalization()

  return (
    <>
      <DialogTitle>
        <div className={globalClasses.centered}>{props.content.WebHookUrl}</div>
      </DialogTitle>
      <>
        <DialogContent>
          <CollapsibleTable webhooks={exampleData.data} />
        </DialogContent>
        <DialogActions>
          <Button aria-label="Cancel button" className={globalClasses.cancelButton} onClick={closeLastDialog}>
            {localization.forms.cancel}
          </Button>
        </DialogActions>
      </>
    </>
  )
}

export default WebhookLogDialog
