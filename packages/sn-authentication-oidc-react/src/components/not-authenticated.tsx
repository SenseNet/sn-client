import React from 'react'
import { Container, Typography } from '@material-ui/core'

export const NotAuthenticated = () => (
  <Container maxWidth="sm">
    <Typography component="h1" gutterBottom>
      Authentication
    </Typography>
    <Typography variant="body1">You are not authenticated.</Typography>
  </Container>
)
