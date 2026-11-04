import { Button, Container, Typography } from '@material-ui/core'
import React from 'react'

export function AuthenticationChoice({
  repositoryUrl,
  onInternal,
  onExternal,
  onCancel,
}: {
  repositoryUrl: string
  onInternal: () => void
  onExternal: () => void
  onCancel: () => void
}) {
  return (
    <Container maxWidth="sm" style={{ paddingTop: 64 }}>
      <Typography variant="h4" gutterBottom>
        Choose how to sign in
      </Typography>
      <Typography paragraph>{repositoryUrl}</Typography>
      <Button variant="contained" color="primary" onClick={onExternal}>
        Use external authentication
      </Button>
      <Button variant="outlined" onClick={onInternal} style={{ margin: 12 }}>
        Use internal authentication
      </Button>
      <Button onClick={onCancel}>Choose another repository</Button>
    </Container>
  )
}
