import Button from '@material-ui/core/Button'
import React, { Component } from 'react'

export interface FetchErrorProps {
  message: string
  onRetry: () => void
}

export class FetchError extends Component<FetchErrorProps, {}> {
  public render() {
    return (
      <div>
        <p>Could not fetch content. {this.props.message}</p>
        <Button onClick={this.props.onRetry}>Retry</Button>
      </div>
    )
  }
}
