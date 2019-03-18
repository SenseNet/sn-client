import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { FormsAuthenticationService } from '@sensenet/client-core'
import { sleepAsync } from '@sensenet/client-utils'
import React, { useContext, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { InjectorContext } from '../context/InjectorContext'
import { PersonalSettingsContext } from '../context/PersonalSettingsContext'
import { RepositoryContext } from '../context/RepositoryContext'
import { SessionContext } from '../context/SessionContext'
import { ThemeContext } from '../context/ThemeContext'
import { PersonalSettings } from '../services/PersonalSettings'
import { UserAvatar } from './UserAvatar'

export const LoginComponent: React.FunctionComponent<RouteComponentProps> = props => {
  const injector = useContext(InjectorContext)
  const repo = useContext(RepositoryContext)
  const theme = useContext(ThemeContext)
  const personalSettings = useContext(PersonalSettingsContext)
  const session = useContext(SessionContext)
  const settingsManager = injector.GetInstance(PersonalSettings)

  const existingRepo = personalSettings.repositories.find(r => r.url === repo.configuration.repositoryUrl)

  const [userName, setUserName] = useState((existingRepo && existingRepo.loginName) || '')
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState(repo.configuration.repositoryUrl)
  const [isInProgress, setIsInProgress] = useState(false)

  const [success, setSuccess] = useState(false)
  const [progressValue, setProgressValue] = useState(0)

  const [error, setError] = useState<string | undefined>()

  return (
    <Paper
      style={{ padding: '1em', flexShrink: 0, width: '450px', maxWidth: '90%', alignSelf: 'center', margin: 'auto' }}>
      <Typography variant="h4">Login</Typography>
      {isInProgress ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 196 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress size={64} variant={success ? 'determinate' : 'indeterminate'} value={progressValue} />
            {success ? (
              // <Check style={{ marginTop: -43, color: theme.palette.text.primary, opacity: progressValue / 100 }} />
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
        <form
          onSubmit={() => {
            const repoToLogin = injector.getRepository(url)
            personalSettings.lastRepository = url
            setIsInProgress(true)
            repoToLogin.authentication
              .login(userName, password)
              .then(s => {
                setSuccess(s)
                if (s) {
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

                  // tslint:disable-next-line: no-string-literal
                  ;(repoToLogin.authentication as FormsAuthenticationService)['getCurrentUser']()
                  ;(async () => {
                    for (let index = 0; index < 100; index++) {
                      await sleepAsync(index / 50)
                      setProgressValue(index)
                    }
                    await sleepAsync(1000)
                    setIsInProgress(false)
                    settingsManager.setValue(personalSettings)
                    props.history.push('/')
                  })()
                } else {
                  setIsInProgress(false)
                  setError('Login failed.')
                }
              })
              .catch(e => {
                console.log('Login error:', e)
                setError(e.toString())
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

export default withRouter(LoginComponent)
