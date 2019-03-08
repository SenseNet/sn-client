import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import React, { useContext, useState } from 'react'
import { InjectorContext } from '../context/InjectorContext'
import { RepositoryManager } from '../services/RepositoryManager'

export const Login: React.FunctionComponent = () => {
  const injector = useContext(InjectorContext)
  const repoManager = injector.GetInstance(RepositoryManager)

  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState(repoManager.currentRepository.getValue().configuration.repositoryUrl)

  return (
    <Paper
      style={{ padding: '1em', flexShrink: 0, width: '450px', maxWidth: '90%', alignSelf: 'center', margin: 'auto' }}>
      <Typography variant="h4">Login</Typography>
      <form
        onSubmit={() => {
          const repo = injector.getRepository(url)
          repoManager.currentRepository.setValue(repo)
          repo.authentication.login(userName, password)
        }}>
        <Divider />
        <TextField
          required={true}
          margin="normal"
          label="Username"
          helperText="Enter the user name you've registered with"
          fullWidth={true}
          // defaultValue={this.props.lastUserName}
          onChange={ev => {
            setUserName(ev.target.value)
          }}
        />
        <TextField
          required={true}
          margin="dense"
          label="Password"
          fullWidth={true}
          type="password"
          helperText="Enter a matching password for the user"
          onChange={ev => {
            setPassword(ev.target.value)
          }}
        />
        <TextField
          margin="dense"
          label="Repository URL"
          fullWidth={true}
          type="url"
          // defaultValue={this.props.lastRepository}
          onChange={ev => {
            setUrl(ev.target.value)
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1em' }}>
          <Button style={{ width: '100%' }} type="submit">
            <Typography variant="button">Log in</Typography>
          </Button>
        </div>
      </form>
    </Paper>
  )
}

export default Login
