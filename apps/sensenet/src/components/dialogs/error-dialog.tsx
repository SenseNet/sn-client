import { Button, DialogActions, DialogContent, DialogContentText } from '@material-ui/core'
import { BugReportTwoTone, RefreshTwoTone } from '@material-ui/icons'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { ErrorBoundaryState } from '../error-boundary'
import { DialogTitle, useDialog } from '.'

export function ErrorDialog(props: ErrorBoundaryState) {
  const { openDialog } = useDialog()
  const localization = useLocalization().errorBoundary
  const globalClasses = useGlobalStyles()

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
          <Button
            aria-label={localization.reload}
            className={globalClasses.cancelButton}
            onClick={() => window.location.reload()}>
            <RefreshTwoTone />
            {localization.reload}
          </Button>

          <Button
            aria-label={localization.reportError}
            className={globalClasses.cancelButton}
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
