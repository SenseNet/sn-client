import { Dialog } from '@material-ui/core'
import React, { lazy, Suspense } from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { DialogWithProps, useDialog } from '.'

const Approve = lazy(() => import('./approve'))
const AreYouSure = lazy(() => import('./are-you-sure'))
const CheckIn = lazy(() => import('./check-in'))
const CopyMove = lazy(() => import('./copy-move'))
const CustomActionResult = lazy(() => import('./custom-action-result'))
const Delete = lazy(() => import('./delete'))
const Error = lazy(() => import('./error-dialog'))
const ExecuteAction = lazy(() => import('./execute-action'))
const Logout = lazy(() => import('./logout'))
const SaveQuery = lazy(() => import('./save-query'))
const Upload = lazy(() => import('./upload/upload-dialog'))
const ReferenceContentList = lazy(() => import('./reference-content-list'))
const PermissionEditorDialog = lazy(() => import('./permission-editor-dialog'))
const MemberSelect = lazy(() => import('./member-select-dialog'))
const Restore = lazy(() => import('./restore'))
const ContentPicker = lazy(() => import('./content-picker'))
const Feedback = lazy(() => import('./feedback'))
const ChangePasswordDialog = lazy(() => import('./change-password'))
const DateRangePicker = lazy(() => import('./date-range-picker'))
const WebhookLog = lazy(() => import('./webhook-log/webhook-log'))

function dialogRenderer(dialog: DialogWithProps) {
  switch (dialog.name) {
    case 'delete':
      return <Delete {...dialog.props} />
    case 'error':
      return <Error {...dialog.props} />
    case 'copy-move':
      return <CopyMove {...dialog.props} />
    case 'check-in':
      return <CheckIn {...dialog.props} />
    case 'are-you-sure':
      return <AreYouSure {...dialog.props} />
    case 'approve':
      return <Approve {...dialog.props} />
    case 'restore':
      return <Restore {...dialog.props} />
    case 'upload':
      return <Upload {...dialog.props} />
    case 'execute-action':
      return <ExecuteAction {...dialog.props} />
    case 'custom-action-result':
      return <CustomActionResult {...dialog.props} />
    case 'logout':
      return <Logout />
    case 'save-query':
      return <SaveQuery {...dialog.props} />
    case 'reference-content-list':
      return <ReferenceContentList {...dialog.props} />
    case 'permission-editor':
      return <PermissionEditorDialog {...dialog.props} />
    case 'member-select':
      return <MemberSelect {...dialog.props} />
    case 'content-picker':
      return <ContentPicker {...dialog.props} />
    case 'feedback':
      return <Feedback />
    case 'change-password':
      return <ChangePasswordDialog />
    case 'date-range-picker':
      return <DateRangePicker {...dialog.props} />
    case 'webhook-log':
      return <WebhookLog {...dialog.props} />
    default:
      return null
  }
}

export function Dialogs() {
  const { dialogs, closeLastDialog } = useDialog()
  const globalClasses = useGlobalStyles()

  return (
    <Suspense fallback="Loading">
      {dialogs.map((dialog, index) => (
        <Dialog
          classes={{ paper: globalClasses.dialog }}
          fullWidth
          key={index}
          open={true}
          maxWidth="md"
          {...dialog.dialogProps}
          onClose={(event, reason) => {
            dialog.dialogProps?.onClose?.(event, reason)
            closeLastDialog()
          }}>
          {dialogRenderer(dialog)}
        </Dialog>
      ))}
    </Suspense>
  )
}
