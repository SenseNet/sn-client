import React, { ElementType } from 'react'
import { Button, Container, Typography } from '@material-ui/core'
import { History } from 'history'
import { getUserManager } from '../authentication-service'
import { authenticateUser } from '../oidc-service'

export type SessionLostProps = {
  onAuthenticate: () => void
}

export const SessionLost = ({ onAuthenticate }: SessionLostProps) => (
  <Container maxWidth="sm">
    <Typography component="h1" gutterBottom>
      Session timed out
    </Typography>
    <Typography variant="body1">Your session has expired. Please re-authenticate yourself.</Typography>
    <Button onClick={onAuthenticate}>re-authenticate</Button>
  </Container>
)

type SessionLostContainerProps = {
  history: History
  SessionLostComponentOverride?: ElementType<SessionLostProps>
}

export const SessionLostContainer = ({ history, SessionLostComponentOverride }: SessionLostContainerProps) => {
  const callbackPath = history.location.search.replace('?path=', '')
  const onAuthenticate = () => {
    authenticateUser(getUserManager()!, history.location, history)(true, callbackPath)
  }
  return SessionLostComponentOverride ? (
    <SessionLostComponentOverride onAuthenticate={onAuthenticate} />
  ) : (
    <SessionLost onAuthenticate={onAuthenticate} />
  )
}
