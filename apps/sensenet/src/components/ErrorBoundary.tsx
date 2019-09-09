import { Injector } from '@furystack/inject'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import BugReportTwoTone from '@material-ui/icons/BugReportTwoTone'
import RefreshTwoTone from '@material-ui/icons/RefreshTwoTone'
import { Repository } from '@sensenet/client-core'
import { ExtendedError, isExtendedError } from '@sensenet/client-core/dist/Repository/Repository'
import React from 'react'
import { InjectorContext } from '@sensenet/hooks-react'
import { LocalizationContext } from '../context'
import { ErrorReport } from './ErrorReport'

export interface ErrorBoundaryState {
  hasError: boolean
  isOpened: boolean
  sendFeedback: boolean
  error?: any
  info?: any
}

export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
  public static contextType: React.Context<Injector> = InjectorContext

  public state: ErrorBoundaryState = { hasError: false, sendFeedback: false, isOpened: true }
  public static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  public async componentDidCatch(error: Error, info: any) {
    let msg: ExtendedError | undefined
    if (isExtendedError(error)) {
      msg = await (this.context as Injector).getInstance(Repository).getErrorFromResponse(error.response)
    }

    const message = (msg && msg.message) || error.message || 'An unhandled error happened'
    ;(this.context as Injector).logger.fatal({
      scope: 'ErrorBoundary',
      message,
      data: {
        details: {
          error: msg || error,
          info,
        },
      },
    })
  }

  public render() {
    if (this.state.hasError) {
      if (this.state.sendFeedback) {
        return (
          <ErrorReport
            error={this.state.error}
            dismiss={() => this.setState({ isOpened: true, sendFeedback: false })}
          />
        )
      }

      return (
        <LocalizationContext.Consumer>
          {localization => (
            <Dialog open={this.state.isOpened} BackdropProps={{ style: { background: 'black' } }} fullWidth={true}>
              <DialogTitle>{localization.values.errorBoundary.title}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {localization.values.errorBoundary.text} <br />
                  {this.state.info} <br />
                  {this.state.error && this.state.error.message ? (
                    <>
                      <strong>Error message: </strong>
                      {this.state.error && this.state.error.message}
                    </>
                  ) : null}
                </DialogContentText>
                <DialogActions>
                  <Button onClick={() => window.location.reload()}>
                    <RefreshTwoTone />
                    {localization.values.errorBoundary.reload}
                  </Button>

                  <Button
                    onClick={() => {
                      this.setState({ sendFeedback: true, isOpened: false })
                    }}>
                    <BugReportTwoTone />
                    {localization.values.errorBoundary.reportError}
                  </Button>
                </DialogActions>
              </DialogContent>
            </Dialog>
          )}
        </LocalizationContext.Consumer>
      )
    }

    return this.props.children
  }
}
