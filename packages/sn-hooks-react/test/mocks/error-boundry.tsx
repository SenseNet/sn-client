import React from 'react'

/* eslint-disable @typescript-eslint/explicit-member-accessibility */
export class ErrorBoundary extends React.Component<{ spy: any }, { hasError: boolean }> {
  static getDerivedStateFromError() {
    return {
      hasError: true,
    }
  }

  constructor(props: Readonly<{ spy: any }>) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error: Error) {
    const { spy } = this.props
    spy(error.message)
  }

  render() {
    const { children } = this.props
    const { hasError } = this.state
    return <React.Fragment>{hasError ? 'Error' : children}</React.Fragment>
  }
}
