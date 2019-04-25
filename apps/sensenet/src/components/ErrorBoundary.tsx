import { Injector } from '@furystack/inject'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import HomeTwoTone from '@material-ui/icons/HomeTwoTone'
import RefreshTwoTone from '@material-ui/icons/RefreshTwoTone'
import { Repository } from '@sensenet/client-core'
import { ExtendedError, isExtendedError } from '@sensenet/client-core/dist/Repository/Repository'
import React from 'react'
import { InjectorContext } from '../context'

export interface ErrorBoundaryState {
  hasError: boolean
  error?: any
  info?: any
}

export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
  public static contextType = InjectorContext

  public state: ErrorBoundaryState = { hasError: false }
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
      return (
        <div style={{ padding: '4em' }}>
          <Typography variant="h4" color="error">
            Something went wrong :(
          </Typography>
          <Typography variant="body1" color="textPrimary">
            <strong>Error message: </strong>
            {this.state.error && this.state.error.message}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {this.state.info}
          </Typography>
          <Button onClick={() => window.location.reload()}>
            <RefreshTwoTone />
            Reload
          </Button>

          <Button onClick={() => window.location.replace('/')}>
            <HomeTwoTone />
            Home
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
