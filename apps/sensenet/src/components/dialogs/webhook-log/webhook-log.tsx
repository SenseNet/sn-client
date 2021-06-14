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
      CreationTime: '2021-06-13T18:31:08.7658781Z',
      Duration: '00:00:00.9000000',
      RequestLength: 101,
      ResponseLength: 1010,
      ResponseStatusCode: 200,
      Url: 'POST https://example.com/hook/2',
      WebHookId: 1242,
      ContentId: 10001,
      EventName: 'Event2',
      ErrorMessage: null,
    },
    {
      CreationTime: '2021-06-13T12:31:08.7658771Z',
      Duration: '00:00:00.9000000',
      RequestLength: 101,
      ResponseLength: 1020,
      ResponseStatusCode: 200,
      Url: 'POST https://example.com/hook/3',
      WebHookId: 1242,
      ContentId: 10002,
      EventName: 'Event3',
      ErrorMessage: null,
    },
    {
      CreationTime: '2021-06-13T06:31:08.7658762Z',
      Duration: '00:00:00.9000000',
      RequestLength: 101,
      ResponseLength: 1030,
      ResponseStatusCode: 200,
      Url: 'POST https://example.com/hook/4',
      WebHookId: 1242,
      ContentId: 10003,
      EventName: 'Event4',
      ErrorMessage: null,
    },
    {
      CreationTime: '2021-06-13T00:31:08.7658751Z',
      Duration: '00:00:00.9000000',
      RequestLength: 101,
      ResponseLength: 1040,
      ResponseStatusCode: 400,
      Url: 'POST https://example.com/hook/5',
      WebHookId: 1242,
      ContentId: 10004,
      EventName: 'Event1',
      ErrorMessage: 'Warning message',
    },
    {
      CreationTime: '2021-06-12T18:31:08.7658742Z',
      Duration: '00:00:00.9000000',
      RequestLength: 101,
      ResponseLength: 1050,
      ResponseStatusCode: 200,
      Url: 'POST https://example.com/hook/1',
      WebHookId: 1242,
      ContentId: 10005,
      EventName: 'Event2',
      ErrorMessage: null,
    },
    {
      CreationTime: '2021-06-12T12:31:08.7658732Z',
      Duration: '00:00:00.9000000',
      RequestLength: 101,
      ResponseLength: 1060,
      ResponseStatusCode: 500,
      Url: 'POST https://example.com/hook/2',
      WebHookId: 1242,
      ContentId: 10006,
      EventName: 'Event3',
      ErrorMessage: 'Error message',
    },
    {
      CreationTime: '2021-06-12T06:31:08.7658722Z',
      Duration: '00:00:00.9000000',
      RequestLength: 101,
      ResponseLength: 1070,
      ResponseStatusCode: 200,
      Url: 'POST https://example.com/hook/3',
      WebHookId: 1242,
      ContentId: 10007,
      EventName: 'Event4',
      ErrorMessage: null,
    },
    {
      CreationTime: '2021-06-12T00:31:08.7658713Z',
      Duration: '00:00:00.9000000',
      RequestLength: 101,
      ResponseLength: 1080,
      ResponseStatusCode: 200,
      Url: 'POST https://example.com/hook/4',
      WebHookId: 1242,
      ContentId: 10008,
      EventName: 'Event1',
      ErrorMessage: null,
    },
    {
      CreationTime: '2021-06-11T18:31:08.7658703Z',
      Duration: '00:00:00.9000000',
      RequestLength: 101,
      ResponseLength: 1090,
      ResponseStatusCode: 400,
      Url: 'POST https://example.com/hook/5',
      WebHookId: 1242,
      ContentId: 10009,
      EventName: 'Event2',
      ErrorMessage: 'Warning message',
    },
    {
      CreationTime: '2021-06-11T12:31:08.7658685Z',
      Duration: '00:00:00.9000000',
      RequestLength: 101,
      ResponseLength: 1100,
      ResponseStatusCode: 200,
      Url: 'POST https://example.com/hook/1',
      WebHookId: 1242,
      ContentId: 10010,
      EventName: 'Event3',
      ErrorMessage: null,
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
