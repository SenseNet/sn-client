import React from 'react'
import uuid from 'uuid/v1'
import {
  ContentInfoDialog,
  CopyMoveDialog,
  DeleteContentDialog,
  DialogDispatch,
  DialogWithProps,
  EditPropertiesDialog,
  ErrorDialog,
  ErrorReport,
  useDialog,
} from '.'

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
    case 'edit':
      return (
        <EditPropertiesDialog
          content={dialog.props.content}
          dialogProps={{
            ...dialog.props.dialogProps,
            open: true,
            onClose: () => dialogDispatcher({ type: 'POP_DIALOG' }),
          }}
        />
      )
    case 'info':
      return (
        <ContentInfoDialog
          key={uuid()}
          content={dialog.props.content}
          dialogProps={{
            ...dialog.props.dialogProps,
            open: true,
            onClose: () => dialogDispatcher({ type: 'POP_DIALOG' }),
          }}
        />
      )
    case 'copy-move':
      return (
        <CopyMoveDialog
          key={uuid()}
          {...dialog.props}
          dialogProps={{
            ...dialog.props.dialogProps,
            open: true,
            onClose: () => dialogDispatcher({ type: 'POP_DIALOG' }),
          }}
        />
      )
    default:
      return null
  }
}

export function Dialogs() {
  const [{ dialogs }, dispatch] = useDialog()

  return <>{dialogs.map(dialog => dialogRenderer(dialog, dispatch))}</>
}
