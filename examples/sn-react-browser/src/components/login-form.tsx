import { Button, Paper, Typography } from '@material-ui/core'
import React from 'react'
import { useOidcAuthentication } from '@sensenet/authentication-oidc-react'

export const LoginForm = () => {
  const { login } = useOidcAuthentication()
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <Paper
        style={{ padding: '1em', flexShrink: 0, width: '450px', maxWidth: '90%', alignSelf: 'center', margin: 'auto' }}>
        <Typography variant="h4">Login</Typography>
        <form
          onSubmit={ev => {
            ev.preventDefault()
            login()
          }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1em' }}>
            <Button style={{ width: '100%' }} type="submit">
              <Typography variant="button">Log in</Typography>
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  )
}
