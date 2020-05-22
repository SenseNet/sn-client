/* eslint-disable require-jsdoc */
import React, { ReactNode, useEffect } from 'react'
import { Container, Typography } from '@material-ui/core'
import { History } from 'history'
import { getUserManager } from '../authentication-service'

export const Callback = () => (
  <Container maxWidth="sm">
    <Typography component="h1" gutterBottom>
      Authentication complete
    </Typography>
    <Typography variant="body1">You will be redirected to your application.</Typography>
  </Container>
)

type CallbackContainerProps = {
  callbackComponentOverride?: ReactNode
  history: History
}

export const CallbackContainer = ({ callbackComponentOverride, history }: CallbackContainerProps) => {
  useEffect(() => {
    async function signIn() {
      try {
        // In here we are most probably going to have userManager if not the error will be catched
        const user = await getUserManager()!.signinRedirectCallback()
        if (user.state.url) {
          history.push(user.state.url)
        } else {
          console.warn('no location in state')
        }
      } catch (error) {
        history.push(`/authentication/not-authenticated?message=${encodeURIComponent(error.message)}`)
      }
    }

    signIn()
  }, [history])

  return callbackComponentOverride ? <>{callbackComponentOverride}</> : <Callback />
}
