import React, { Suspense } from 'react'
import { Dialog } from '@material-ui/core'
import { DialogWithProps, EditProperties, useDialog } from '.'

const Add = React.lazy(() => import('./add'))
const Approve = React.lazy(() => import('./approve'))
const AreYouSure = React.lazy(() => import('./are-you-sure'))
const CheckIn = React.lazy(() => import('./check-in'))
const ContentInfo = React.lazy(() => import('./content-info'))
const CopyMove = React.lazy(() => import('./copy-move'))
const CustomActionResult = React.lazy(() => import('./custom-action-result'))
const Delete = React.lazy(() => import('./delete'))
const ErrorReport = React.lazy(() => import('./error-report'))
const Error = React.lazy(() => import('./error-dialog'))
const ExecuteAction = React.lazy(() => import('./execute-action'))
const Logout = React.lazy(() => import('./logout'))
const Upload = React.lazy(() => import('./upload/upload-dialog'))
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
    case 'approve':
      return <Approve {...dialog.props} />
    case 'add':
      return <Add {...dialog.props} />
    case 'upload':
      return <Upload {...dialog.props} />
    case 'execute-action':
      return <ExecuteAction {...dialog.props} />
    case 'custom-action-result':
      return <CustomActionResult {...dialog.props} />
    case 'logout':
      return <Logout {...dialog.props} />
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
