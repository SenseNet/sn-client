import { Button, DialogActions, DialogContent, DialogContentText } from '@material-ui/core'
import { RefreshTwoTone } from '@material-ui/icons'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { ErrorBoundaryState } from '../error-boundary'
import { DialogTitle } from '.'

export function ErrorDialog(props: ErrorBoundaryState) {
  const localization = useLocalization().errorBoundary
  const globalClasses = useGlobalStyles()

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
        </DialogActions>
      </DialogContent>
    </>
  )
}

export default ErrorDialog
