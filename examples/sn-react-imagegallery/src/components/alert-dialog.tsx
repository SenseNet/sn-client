import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import React, { FunctionComponent, useState } from 'react'

interface AlertDialogProps {
  title: string | JSX.Element
  content: string | JSX.Element
  cancelText?: string
  okText?: string
  handleCancelClick?: () => void
  handleOkClick?: () => void
  renderOpenController: (handleClickOpen: () => void) => JSX.Element
}

export const AlertDialog: FunctionComponent<AlertDialogProps> = (props) => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCancelClick = () => {
    props.handleCancelClick?.()
    handleClose()
  }

  const handleOkClick = () => {
    props.handleOkClick?.()
    handleClose()
  }

  return (
    <>
      {props.renderOpenController(handleClickOpen)}
      <Dialog
        open={open}
        onClose={handleCancelClick}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{props.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {props.cancelText && (
            <Button onClick={handleCancelClick} color="primary">
              {props.cancelText}
            </Button>
          )}
          {props.okText && (
            <Button onClick={handleOkClick} color="primary" autoFocus>
              {props.okText}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}
