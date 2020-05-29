import { Button, Container, Grid, Typography } from '@material-ui/core'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

export interface InvalidPathErrorBoundaryState {
  error?: Error
  currentPath: string
}

export interface InvalidPathError {
  currentPath?: string
  error?: Error
}

class InvalidPath extends React.Component<RouteComponentProps, InvalidPathErrorBoundaryState> {
  public static getDerivedStateFromError(errorState: InvalidPathError) {
    if (errorState.error && errorState.currentPath) {
      return {
        error: errorState.error,
        currentPath: errorState.currentPath,
      }
    }
    throw errorState
  }

  state = {
    error: undefined,
    currentPath: '',
  }

  public render() {
    const { children } = this.props
    const { currentPath, error } = this.state

    if (error) {
      return (
        <Container maxWidth="sm">
          <Grid container direction="column" justify="center">
            <Typography align="center" variant="h5" component="p" style={{ marginTop: '2rem' }}>
              Cannot find path {currentPath}
            </Typography>
            <Button
              onClick={() => {
                this.setState({
                  error: undefined,
                  currentPath: '',
                })
                this.props.history.push(this.props.match.url)
              }}>
              Go to root
            </Button>
          </Grid>
        </Container>
      )
    }

    return children
  }
}

export const InvalidPathErrorBoundary = withRouter(InvalidPath)
