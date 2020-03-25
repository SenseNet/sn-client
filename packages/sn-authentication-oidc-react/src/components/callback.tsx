import { History } from 'history'
import React, { ReactNode, useEffect } from 'react'
import { Container, Typography } from '@material-ui/core'
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
    // eslint-disable-next-line require-jsdoc
    async function signIn() {
      const userManager = getUserManager()
      if (!userManager) {
        console.error('No usermanager')
        return
      }

      try {
        const user = await userManager.signinRedirectCallback()
        console.info('Successfull login Callback', user)
        if (user.state.url) {
          history.push(user.state.url)
        } else {
          console.warn('no location in state')
        }
      } catch (error) {
        console.error(`There was an error handling the token callback: ${error.message}`)
        history.push(`/authentication/not-authenticated?message=${encodeURIComponent(error.message)}`)
      }
    }

    signIn()
  }, [history])

  return callbackComponentOverride ? <>{callbackComponentOverride}</> : <Callback />
}
