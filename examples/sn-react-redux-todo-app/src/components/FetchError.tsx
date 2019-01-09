import Button from '@material-ui/core/Button'
import * as React from 'react'

interface FetchErrorProps {
  message: string
  onRetry: () => void
}

/**
 * class
 */
export class FetchError extends React.Component<FetchErrorProps, {}> {
  /**
   * render
   */
  public render() {
    return (
      <div>
        <p>Could not fetch content. {this.props.message.toString()}</p>
        <Button variant="raised" color="primary" onClick={this.props.onRetry}>
          Retry
        </Button>
      </div>
    )
  }
}
