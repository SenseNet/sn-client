import React, { Suspense } from 'react'
import { Dialog } from '@material-ui/core'
import { DialogWithProps, EditProperties, useDialog } from '.'

const AreYouSure = React.lazy(() => import('./are-you-sure'))
const CheckIn = React.lazy(() => import('./check-in'))
const ContentInfo = React.lazy(() => import('./content-info'))
const CopyMove = React.lazy(() => import('./copy-move'))
const Delete = React.lazy(() => import('./delete'))
const ErrorReport = React.lazy(() => import('./error-report'))
const Error = React.lazy(() => import('./error-dialog'))
const Versions = React.lazy(() => import('./versions'))

function dialogRenderer(dialog: DialogWithProps) {
  switch (dialog.name) {
    case 'delete':
      return <Delete {...dialog.props} />
    case 'error-report':
      return <ErrorReport {...dialog.props} />
    case 'error':
      return <Error {...dialog.props} />
    case 'edit':
      return <EditProperties {...dialog.props} />
    case 'info':
      return <ContentInfo {...dialog.props} />
    case 'copy-move':
      return <CopyMove {...dialog.props} />
    case 'check-in':
      return <CheckIn {...dialog.props} />
    case 'versions':
      return <Versions {...dialog.props} />
    case 'are-you-sure':
      return <AreYouSure {...dialog.props} />
    default:
      return null
  }
}

export function Dialogs() {
  const { dialogs, closeLastDialog } = useDialog()

  return (
    //TODO: Proper fall back component?
    <Suspense fallback="Loading">
      {dialogs.map((dialog, index) => (
        <Dialog
          {...dialog.dialogProps}
          fullWidth
          onClose={(event, reason) => {
            dialog.dialogProps?.onClose?.(event, reason)
            closeLastDialog()
          }}
          key={index}
          open={true}>
          {dialogRenderer(dialog)}
        </Dialog>
      ))}
    </Suspense>
  )
}
