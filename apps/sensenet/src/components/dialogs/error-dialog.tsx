import React from 'react'
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import { BugReportTwoTone, RefreshTwoTone } from '@material-ui/icons'
import { ErrorBoundaryState } from '../error-boundary'
import { useLocalization } from '../../hooks'
import { useDialog } from '.'

export function ErrorDialog(props: ErrorBoundaryState) {
  const { openDialog } = useDialog()
  const localization = useLocalization().errorBoundary

  const openErrorReportingDialog = () => {
    openDialog({
      name: 'error-report',
      props: { error: props.error! },
      dialogProps: { BackdropProps: { style: { background: 'black' } }, open: true },
    })
  }

  return (
    <>
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
    </>
  )
}

export default ErrorDialog
