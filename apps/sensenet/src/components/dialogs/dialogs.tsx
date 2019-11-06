import React from 'react'
import uuid from 'uuid/v1'
import { DeleteContentDialog, DialogDispatch, DialogWithProps, ErrorDialog, ErrorReport, useDialog } from '.'

function dialogRenderer(dialog: DialogWithProps, dialogDispatcher: DialogDispatch) {
  switch (dialog.name) {
    case 'delete':
      return (
        <DeleteContentDialog
          key={dialog.props.content[0].Id}
          dialogProps={{
            ...dialog.props.dialogProps,
            open: true,
            onClose: () => dialogDispatcher({ type: 'POP_DIALOG' }),
          }}
          content={dialog.props.content}
        />
      )
    case 'error-report':
      return <ErrorReport key={uuid()} {...dialog.props} />
    case 'error':
      return <ErrorDialog key={uuid()} {...dialog.props} />
    default:
      return null
  }
}

export function Dialogs() {
  const [{ dialogs }, dispatch] = useDialog()

  return <>{dialogs.map(dialog => dialogRenderer(dialog, dispatch))}</>
}
