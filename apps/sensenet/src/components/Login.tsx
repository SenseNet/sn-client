import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { ConstantContent, FormsAuthenticationService } from '@sensenet/client-core'
import { Retrier, sleepAsync } from '@sensenet/client-utils'
import React, { useContext, useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { useInjector, useLocalization, usePersonalSettings, useRepository, useSession, useTheme } from '../hooks'
import { PersonalSettings } from '../services/PersonalSettings'
import { UserAvatar } from './UserAvatar'

export const Login: React.FunctionComponent<RouteComponentProps> = props => {
  const injector = useInjector()
  const repo = useRepository()
  const theme = useTheme()
  const personalSettings = usePersonalSettings()
  const session = useSession()
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

  const localization = useLocalization().login

  useEffect(() => {
    setUrl(repo.configuration.repositoryUrl)
    existingRepo && existingRepo.loginName && setUserName(existingRepo.loginName)
  }, [repo.configuration.repositoryUrl])

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
        settingsManager.setValue(personalSettings)
        await Retrier.create(
          async () => repoToLogin.authentication.currentUser.getValue().Id !== ConstantContent.VISITOR_USER.Id,
        )
          .setup({
            timeoutMs: 60 * 1000,
            RetryIntervalMs: 100,
          })
          .run()
        for (let index = 0; index < 100; index++) {
          await sleepAsync(index / 50)
          setProgressValue(index)
        }
        logger.information({
          message: localization.loginSuccessNotification.replace('{0}', userName).replace('{1}', url),
          data: {
            relatedContent: repoToLogin.authentication.currentUser.getValue(),
            relatedRepository: repoToLogin.configuration.repositoryUrl,
          },
        })
        if (props.match.path === '/login') {
          await sleepAsync(1800)
          props.history.push('/')
        }
      } else {
        setIsInProgress(false)
        setError(localization.loginFailed)
        logger.warning({
          message: localization.loginFailedNotification.replace('{0}', userName).replace('{1}', url),
        })
      }
    } catch (error) {
      logger.error({
        message: localization.loginErrorNotification.replace('{0}', userName).replace('{1}', url),
        data: {
          details: { error },
        },
      })
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
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
              value={userName}
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
              required={true}
              label={localization.repositoryLabel}
              helperText={localization.repositoryHelperText}
              fullWidth={true}
              type="url"
              value={url}
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
    </div>
  )
}

export default withRouter(Login)
