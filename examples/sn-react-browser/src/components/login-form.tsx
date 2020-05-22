import { useOidcAuthentication } from '@sensenet/authentication-oidc-react'
import React from 'react'
import { Button, Paper, Typography } from '@material-ui/core'
import { repositoryUrl } from '../configuration'

export const LoginForm = () => {
  const { login } = useOidcAuthentication()

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <Paper
        style={{ padding: '1em', flexShrink: 0, width: '450px', maxWidth: '90%', alignSelf: 'center', margin: 'auto' }}>
        <Typography variant="h4">Login to {repositoryUrl}</Typography>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1em' }}>
          <Button style={{ width: '100%' }} onClick={login}>
            <Typography variant="button">Log in</Typography>
          </Button>
        </div>
      </Paper>
    </div>
  )
}
