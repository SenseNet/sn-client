import { Container, Typography } from '@material-ui/core'
import React from 'react'

export const NotAuthorized = () => (
  <Container maxWidth="sm">
    <Typography component="h1" gutterBottom>
      Authorization
    </Typography>
    <Typography variant="body1">You are not authorized to access this resource.</Typography>
  </Container>
)
