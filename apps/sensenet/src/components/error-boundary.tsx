import { ExtendedError, isExtendedError, Repository } from '@sensenet/client-core'
import { Injector } from '@sensenet/client-utils'
import { InjectorContext } from '@sensenet/hooks-react'
import React, { Component, ComponentType, Context } from 'react'

export interface ErrorBoundaryState {
  error?: Error
  info?: {
    componentStack?: string
  }
}

export interface ErrorBoundaryProps {
  FallbackComponent?: ComponentType<ErrorBoundaryState>
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public static contextType: Context<Injector> = InjectorContext
  public static getDerivedStateFromError(error?: Error) {
    return {
      error,
      info: { componentStack: error && error.stack },
    }
  }

  state = {
    error: undefined,
    info: undefined,
  }

  public async componentDidCatch(error?: Error) {
    let msg: ExtendedError | undefined
    if (error && isExtendedError(error)) {
      msg = await (this.context as Injector).getInstance(Repository).getErrorFromResponse(error.response)
    }

    const message = (msg && msg.message) || (error && error.message) || 'An unhandled error happened'
    ;(this.context as Injector).logger.fatal({
      scope: 'ErrorBoundary',
      message,
      data: {
        error: msg || error,
        details: {
          info: this.state.info,
        },
      },
    })
  }

  public render() {
    const { FallbackComponent, children } = this.props
    const { error, info } = this.state

    if (error) {
      if (FallbackComponent) return <FallbackComponent error={error} info={info} />

      return null
    }

    return children
  }
}
