import React from 'react'
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import { BugReportTwoTone, RefreshTwoTone } from '@material-ui/icons'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { ErrorBoundaryState } from '../error-boundary'
import { useDialog } from '.'

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
          <Button className={globalClasses.cancelButton} onClick={() => window.location.reload()}>
            <RefreshTwoTone />
            {localization.reload}
          </Button>

          <Button
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
