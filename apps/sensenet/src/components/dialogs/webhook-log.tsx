import { WebhookSubscription } from '@sensenet/default-content-types'
import { Button, DialogActions, DialogContent, DialogContentText } from '@material-ui/core'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { DialogTitle, useDialog } from '.'

export type WebhookLogDialogProps = {
  content: WebhookSubscription
}

export const WebhookLogDialog: React.FunctionComponent<WebhookLogDialogProps> = (props) => {
  const { closeLastDialog } = useDialog()
  const globalClasses = useGlobalStyles()

  return (
    <>
      <DialogTitle>
        <div className={globalClasses.centered}>{props.content.WebHookUrl}</div>
      </DialogTitle>
      <>
        <DialogContent>
          <DialogContentText style={{ wordBreak: 'break-word' }}>asd</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button aria-label="Cancel button" className={globalClasses.cancelButton} onClick={closeLastDialog}>
            CANCEL
          </Button>
          <Button aria-label="Submit button" color="primary" variant="contained" autoFocus={true}>
            SUBMIT
          </Button>
        </DialogActions>
      </>
    </>
  )
}

export default WebhookLogDialog
