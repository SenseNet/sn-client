import React from 'react'
import { Container, Typography } from '@material-ui/core'

export const NotAuthorized = () => (
  <Container maxWidth="sm">
    <Typography component="h1" gutterBottom>
      Authorization
    </Typography>
    <Typography variant="body1">You are not authorized to access this resource.</Typography>
  </Container>
)
