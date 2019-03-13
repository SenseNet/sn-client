import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import React, { useContext, useState } from 'react'
import { InjectorContext } from '../context/InjectorContext'
import { PersonalSettingsContext } from '../context/PersonalSettingsContext'
import { RepositoryContext } from '../context/RepositoryContext'
import { PersonalSettings } from '../services/PersonalSettings'
import { RepositorySelector } from './RepositorySelector'
export const Login: React.FunctionComponent = () => {
  const injector = useContext(InjectorContext)
  const repo = useContext(RepositoryContext)
  const personalSettings = useContext(PersonalSettingsContext)
  const settingsManager = injector.GetInstance(PersonalSettings)

  const existingRepo = personalSettings.repositories.find(r => r.url === personalSettings.lastRepository)

  const [userName, setUserName] = useState((existingRepo && existingRepo.loginName) || '')
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState(repo.configuration.repositoryUrl)

  return (
    <Paper
      style={{ padding: '1em', flexShrink: 0, width: '450px', maxWidth: '90%', alignSelf: 'center', margin: 'auto' }}>
      <Typography variant="h4">Login</Typography>
      <form
        onSubmit={() => {
          const repoToLogin = injector.getRepository(url)
          personalSettings.lastRepository = url
          repoToLogin.authentication.login(userName, password).then(success => {
            if (success) {
              const existing = personalSettings.repositories.find(i => i.url === url)
              if (!existing) {
                personalSettings.repositories.push({ url, loginName: userName })
              } else {
                personalSettings.repositories = personalSettings.repositories.map(r => {
                  if (r.url === url) {
                    r.loginName = userName
                  }
                  return r
                })
              }
              settingsManager.setValue(personalSettings)
            }
          })
        }}>
        <Divider />
        <TextField
          required={true}
          margin="normal"
          label="Username"
          helperText="Enter the user name you've registered with"
          fullWidth={true}
          defaultValue={userName}
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
          defaultValue={repo.configuration.repositoryUrl}
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
