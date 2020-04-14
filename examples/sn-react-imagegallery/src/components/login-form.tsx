import React, { useState } from 'react'
import { Button, Divider, Paper, TextField, Typography } from '@material-ui/core'
import { lastRepositoryKey } from '../context/repository-provider'

export interface LoginFormProps {
  /**
   * Callback that will be called when the user clicks the Login button
   */
  onLogin: (username: string, passowrd: string, repository: string) => void

  /**
   * An optional error message
   */
  error?: string
}

/**
 * Login component for sensenet repositories
 * @param props The Props object
 */
export const LoginForm: React.FunctionComponent<LoginFormProps> = (props) => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState(localStorage.getItem(lastRepositoryKey) || '')

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <Paper
        style={{ padding: '1em', flexShrink: 0, width: '450px', maxWidth: '90%', alignSelf: 'center', margin: 'auto' }}>
        <Typography variant="h4">Login</Typography>
        <form
          onSubmit={(ev) => {
            ev.preventDefault()
            props.onLogin(userName, password, url)
          }}>
          <Divider />
          <TextField
            required={true}
            margin="normal"
            label={'Username'}
            helperText={'The user login name'}
            fullWidth={true}
            value={userName}
            autoComplete="on"
            onChange={(ev) => {
              setUserName(ev.target.value)
            }}
          />
          <TextField
            required={true}
            margin="dense"
            label={'Password'}
            fullWidth={true}
            type="password"
            helperText={"The user's matching password to log in"}
            onChange={(ev) => {
              setPassword(ev.target.value)
            }}
          />
          <TextField
            margin="dense"
            required={true}
            label={'Repository URL'}
            helperText={'e.g. https://dev.demo.sensenet.com'}
            fullWidth={true}
            type="url"
            value={url}
            autoComplete="on"
            onChange={(ev) => {
              setUrl(ev.target.value)
            }}
          />
          {props.error ? <Typography color="error">{props.error}</Typography> : null}

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
