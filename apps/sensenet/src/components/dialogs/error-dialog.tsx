import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import { BugReportTwoTone, RefreshTwoTone } from '@material-ui/icons'
import { ErrorBoundaryState } from '../error-boundary'
import { useLocalization } from '../../hooks'
import { useDialogDispatch } from '.'

export function ErrorDialog(props: ErrorBoundaryState) {
  const dispatchDialogAction = useDialogDispatch()
  const localization = useLocalization().errorBoundary

  const openErrorReportingDialog = () => {
    dispatchDialogAction({
      type: 'PUSH_DIALOG',
      dialog: {
        name: 'error-report',
        props: { dismiss: () => dispatchDialogAction({ type: 'CLOSE_ALL_DIALOGS' }), error: props.error! },
      },
    })
  }

  return (
    <Dialog open={true} BackdropProps={{ style: { background: 'black' } }} fullWidth={true}>
      <DialogTitle>{localization.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {localization.text} <br />
          {props.info && props.info.componentStack} <br />
          {props.error && props.error.message ? (
            <>
              <strong>Error message: </strong>
              {props.error && props.error.message}
            </>
          ) : null}
        </DialogContentText>
        <DialogActions>
          <Button onClick={() => window.location.reload()}>
            <RefreshTwoTone />
            {localization.reload}
          </Button>

          <Button
            onClick={() => {
              openErrorReportingDialog()
            }}>
            <BugReportTwoTone />
            {localization.reportError}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default ErrorDialog
