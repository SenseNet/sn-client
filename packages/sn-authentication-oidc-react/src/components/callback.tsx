import { Container, Typography } from '@material-ui/core'
import { History } from 'history'
import React, { ReactNode, useEffect } from 'react'
import { getUserManager } from '../authentication-service'
import { isSupersededOidcOperation } from '../user-manager-lifecycle'

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
    let active = true
    ;(async () => {
      try {
        // In here we are most probably going to have userManager if not the error will be catched
        const user = await getUserManager()!.signinRedirectCallback()
        if (!active) return
        if (user.state.url) {
          history.push(user.state.url)
        } else {
          console.warn('no location in state')
        }
      } catch (error) {
        if (active && !isSupersededOidcOperation(error))
          history.push(`/authentication/not-authenticated?message=${encodeURIComponent(error.message)}`)
      }
    })()
    return () => {
      active = false
    }
  }, [history])

  return callbackComponentOverride ? <>{callbackComponentOverride}</> : <Callback />
}
