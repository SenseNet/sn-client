import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'

/**
 * Interface for confirmation dialog component properties
 */
export interface ConfirmationDialogProps {
  dialogTitle: string
  okButtonText?: string
  cancelButtonText?: string
  isOpen: boolean
  onClose: (isCanceled: boolean) => void
}

/**
 * Represents a confirmation dialog
 */
export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (props) => {
  const handleCancel = () => props.onClose(true)
  const handleOk = () => props.onClose(false)
  return (
    <Dialog
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
      maxWidth="md"
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      open={props.isOpen}>
      <DialogTitle id="confirmation-dialog-title">{props.dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText
          dangerouslySetInnerHTML={{ __html: props.children as string }}
          id="confirmation-dialog-description"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOk} variant="contained" color="primary">
          {props.okButtonText || 'ok'}
        </Button>
        <Button onClick={handleCancel}>{props.cancelButtonText || 'cancel'}</Button>
      </DialogActions>
    </Dialog>
  )
}
