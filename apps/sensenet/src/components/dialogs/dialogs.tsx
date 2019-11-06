import React from 'react'
import uuid from 'uuid/v1'
import { Dialog } from '@material-ui/core'
import {
  ContentInfoDialog,
  CopyMoveDialog,
  DeleteContentDialog,
  DialogWithProps,
  EditProperties,
  ErrorDialog,
  ErrorReport,
  useDialog,
} from '.'

function dialogRenderer(dialog: DialogWithProps) {
  switch (dialog.name) {
    case 'delete':
      return <DeleteContentDialog {...dialog.props} />
    case 'error-report':
      return <ErrorReport {...dialog.props} />
    case 'error':
      return <ErrorDialog {...dialog.props} />
    case 'edit':
      return <EditProperties {...dialog.props} />
    case 'info':
      return <ContentInfoDialog {...dialog.props} />
    case 'copy-move':
      return <CopyMoveDialog {...dialog.props} />
    default:
      return null
  }
}

export function Dialogs() {
  const { dialogs, closeLastDialog } = useDialog()

  return (
    <>
      {dialogs.map(dialog => (
        <Dialog {...dialog.dialogProps} fullWidth onClose={closeLastDialog} key={uuid()} open={true}>
          {dialogRenderer(dialog)}
        </Dialog>
      ))}
    </>
  )
}
