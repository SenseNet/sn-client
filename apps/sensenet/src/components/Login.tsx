import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { FormsAuthenticationService } from '@sensenet/client-core'
import { sleepAsync } from '@sensenet/client-utils'
import React, { useContext, useState } from 'react'
import { InjectorContext } from '../context/InjectorContext'
import { PersonalSettingsContext } from '../context/PersonalSettingsContext'
import { RepositoryContext } from '../context/RepositoryContext'
import { SessionContext } from '../context/SessionContext'
import { ThemeContext } from '../context/ThemeContext'
import { PersonalSettings } from '../services/PersonalSettings'
import { UserAvatar } from './UserAvatar'

export const Login: React.FunctionComponent = () => {
  const injector = useContext(InjectorContext)
  const repo = useContext(RepositoryContext)
  const theme = useContext(ThemeContext)
  const personalSettings = useContext(PersonalSettingsContext)
  const session = useContext(SessionContext)
  const settingsManager = injector.getInstance(PersonalSettings)

  const existingRepo = personalSettings.repositories.find(r => r.url === repo.configuration.repositoryUrl)

  const [userName, setUserName] = useState((existingRepo && existingRepo.loginName) || '')
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState(repo.configuration.repositoryUrl)
  const [isInProgress, setIsInProgress] = useState(false)

  const [success, setSuccess] = useState(false)
  const [progressValue, setProgressValue] = useState(0)

  const [error, setError] = useState<string | undefined>()

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const repoToLogin = injector.getRepository(url)
    personalSettings.lastRepository = url
    try {
      setIsInProgress(true)
      const result = await repoToLogin.authentication.login(userName, password)
      setSuccess(result)
      if (result) {
        setError(undefined)
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
        ;(repoToLogin.authentication as FormsAuthenticationService).getCurrentUser()
        for (let index = 0; index < 100; index++) {
          await sleepAsync(index / 50)
          setProgressValue(index)
        }
        settingsManager.setValue(personalSettings)
        await sleepAsync(2000)
        setIsInProgress(false)
      } else {
        setIsInProgress(false)
        setError('Login failed.')
      }
    } catch (error) {
      console.log('Login error:', error)
      setError(error.toString())
    } finally {
      setIsInProgress(false)
    }
  }

  return (
    <Paper
      style={{ padding: '1em', flexShrink: 0, width: '450px', maxWidth: '90%', alignSelf: 'center', margin: 'auto' }}>
      <Typography variant="h4">Login</Typography>
      {isInProgress ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 196 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress size={64} variant={success ? 'determinate' : 'indeterminate'} value={progressValue} />
            {success ? (
              <UserAvatar
                style={{ width: 56, height: 56, marginTop: -60, opacity: progressValue / 100 }}
                user={session.currentUser}
                repositoryUrl={url}
              />
            ) : null}
            <Typography
              style={{
                marginTop: '3em',
                wordBreak: 'break-word',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
              }}>
              {success ? (
                <>
                  Greetings,{' '}
                  {session.currentUser.DisplayName || session.currentUser.LoginName || session.currentUser.Name}!
                </>
              ) : (
                <>Logging in to {url}...</>
              )}
            </Typography>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
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
          {error ? <Typography style={{ color: theme.palette.error.main }}>{error}</Typography> : null}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1em' }}>
            <Button style={{ width: '100%' }} type="submit">
              <Typography variant="button">Log in</Typography>
            </Button>
          </div>
        </form>
      )}
    </Paper>
  )
}

export default Login
