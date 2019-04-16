import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { FormsAuthenticationService } from '@sensenet/client-core'
import { sleepAsync } from '@sensenet/client-utils'
import React, { useContext, useState } from 'react'
import {
  InjectorContext,
  LocalizationContext,
  PersonalSettingsContext,
  RepositoryContext,
  SessionContext,
  ThemeContext,
} from '../context'
import { PersonalSettings } from '../services/PersonalSettings'
import { UserAvatar } from './UserAvatar'

export const Login: React.FunctionComponent = () => {
  const injector = useContext(InjectorContext)
  const repo = useContext(RepositoryContext)
  const theme = useContext(ThemeContext)
  const personalSettings = useContext(PersonalSettingsContext)
  const session = useContext(SessionContext)
  const settingsManager = injector.getInstance(PersonalSettings)

  const logger = injector.logger.withScope('LoginComponent')

  const existingRepo = personalSettings.repositories.find(r => r.url === repo.configuration.repositoryUrl)

  const [userName, setUserName] = useState((existingRepo && existingRepo.loginName) || '')
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState(repo.configuration.repositoryUrl)
  const [isInProgress, setIsInProgress] = useState(false)

  const [success, setSuccess] = useState(false)
  const [progressValue, setProgressValue] = useState(0)

  const [error, setError] = useState<string | undefined>()

  const localization = useContext(LocalizationContext).values.login

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
        logger.information({
          message: localization.loginSuccessNoty.replace('{0}', userName).replace('{1}', url),
          data: { shouldNotify: true, unique: true },
        })
        setIsInProgress(false)
      } else {
        setIsInProgress(false)
        setError(localization.loginFailed)
        logger.warning({
          message: localization.loginFailedNoty.replace('{0}', userName).replace('{1}', url),
          data: { shouldNotify: true, unique: true },
        })
      }
    } catch (error) {
      logger.error({
        message: localization.loginErrorNoty.replace('{0}', userName).replace('{1}', url),
        data: { shouldNotify: true, unique: true, error },
      })
      setError(error.toString())
    } finally {
      setIsInProgress(false)
    }
  }

  return (
    <Paper
      style={{ padding: '1em', flexShrink: 0, width: '450px', maxWidth: '90%', alignSelf: 'center', margin: 'auto' }}>
      <Typography variant="h4">{localization.loginTitle}</Typography>
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
                  {localization.greetings.replace(
                    '{0}',
                    session.currentUser.DisplayName || session.currentUser.LoginName || session.currentUser.Name,
                  )}
                </>
              ) : (
                <>{localization.loggingInTo.replace('{0}', url)}</>
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
            label={localization.userNameLabel}
            helperText={localization.userNameHelperText}
            fullWidth={true}
            defaultValue={userName}
            onChange={ev => {
              setUserName(ev.target.value)
            }}
          />
          <TextField
            required={true}
            margin="dense"
            label={localization.passwordLabel}
            fullWidth={true}
            type="password"
            helperText={localization.passwordHelperText}
            onChange={ev => {
              setPassword(ev.target.value)
            }}
          />
          <TextField
            margin="dense"
            label={localization.repositoryLabel}
            helperText={localization.repositoryHelperText}
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
              <Typography variant="button">{localization.loginButtonTitle}</Typography>
            </Button>
          </div>
        </form>
      )}
    </Paper>
  )
}

export default Login
