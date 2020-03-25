import React from 'react'
import { Container, Typography } from '@material-ui/core'

export const Authenticating = () => (
  <Container maxWidth="sm">
    <Typography component="h1" gutterBottom>
      Authentication in progress
    </Typography>
    <Typography variant="body1">You will be redirected to the login page</Typography>
  </Container>
)
