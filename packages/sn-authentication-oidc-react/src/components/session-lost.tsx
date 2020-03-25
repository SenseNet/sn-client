import { Button, Container, Typography } from '@material-ui/core'
import { History } from 'history'
import React, { ReactNode } from 'react'
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
  sessionLostComponentOverride?: (props: SessionLostProps) => ReactNode
}

export const SessionLostContainer = ({ history, sessionLostComponentOverride }: SessionLostContainerProps) => {
  const callbackPath = history.location.search.replace('?path=', '')
  const onAuthenticate = () => {
    const userManager = getUserManager()
    if (!userManager) {
      console.error('SessionLostContainer: No user manager found.')
      return
    }
    authenticateUser(userManager, history.location, history)(true, callbackPath)
  }
  return sessionLostComponentOverride ? (
    <>{sessionLostComponentOverride({ onAuthenticate })}</>
  ) : (
    <SessionLost onAuthenticate={onAuthenticate} />
  )
}
