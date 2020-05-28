import { Container, Typography } from '@material-ui/core'
import React from 'react'

export const NotAuthenticated = () => (
  <Container maxWidth="sm">
    <Typography component="h1" gutterBottom>
      Authentication
    </Typography>
    <Typography variant="body1">You are not authenticated.</Typography>
  </Container>
)
