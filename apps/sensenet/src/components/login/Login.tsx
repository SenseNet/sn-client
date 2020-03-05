import { Container, createStyles, makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { ConstantContent, FormsAuthenticationService } from '@sensenet/client-core'
import { Retrier, sleepAsync } from '@sensenet/client-utils'
import { useInjector, useRepository, useSession } from '@sensenet/hooks-react'
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router'
import { useLocalization, useTheme } from '../../hooks'
import { PersonalSettings, PersonalSettingsType } from '../../services/PersonalSettings'
import { UserAvatar } from '../UserAvatar'
import { DemoUser, InfoBox } from './info-box'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      display: 'flex',
      marginBottom: theme.spacing(2),
      flexDirection: 'column',
      alignItems: 'center',
    },
    loginInput: {
      '& div': {
        '&::before': {
          borderBottom: 'none',
        },
        '&::after': {
          borderBottom: 'none',
        },
        '&:hover:not(.Mui-disabled):before': {
          borderBottom: 'none',
        },
      },
      '& input:focus': {
        borderColor: theme.palette.primary.main,
      },
    },
  }),
)

export const Login = () => {
  const injector = useInjector()
  const history = useHistory()
  const match = useRouteMatch()
  const location = useLocation<{ from: string }>()
  const repo = useRepository()
  const theme = useTheme()
  const classes = useStyles()
  const personalSettings = injector.getInstance(PersonalSettings).userValue.getValue()
  const session = useSession()
  const settingsManager = injector.getInstance(PersonalSettings)

  const logger = injector.logger.withScope('LoginComponent')

  const repositories: PersonalSettingsType['repositories'] = personalSettings.repositories || []

  const existingRepo = repositories.find(r => r.url === repo.configuration.repositoryUrl)

  const [userName, setUserName] = useState((existingRepo && existingRepo.loginName) || '')
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState(repo.configuration.repositoryUrl)
  const [isInProgress, setIsInProgress] = useState(false)

  const [success, setSuccess] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const [inputState, setInputState] = useState({
    userName: { isValid: true, errorMessage: '' },
    password: { isValid: true, errorMessage: '' },
    repository: { isValid: true, errorMessage: '' },
  })

  const [error, setError] = useState<string | undefined>()

  const localization = useLocalization().login

  useEffect(() => {
    setUrl(repo.configuration.repositoryUrl)
    existingRepo && existingRepo.loginName && setUserName(existingRepo.loginName)
  }, [existingRepo, repo.configuration.repositoryUrl])

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    login(userName, password, url)
  }

  const login = async (userNameParam: string, passwordParam: string, urlParam: string) => {
    const repoToLogin = injector.getRepository(urlParam)
    personalSettings.lastRepository = urlParam
    try {
      setIsInProgress(true)
      const result = await repoToLogin.authentication.login(userNameParam, passwordParam)
      setSuccess(result)
      if (result) {
        setError(undefined)
        const existing = repositories.find(i => i.url === urlParam)
        if (!existing) {
          repositories.push({ url: urlParam, loginName: userNameParam })
        } else {
          personalSettings.repositories = repositories.map(r => {
            if (r.url === urlParam) {
              r.loginName = userNameParam
            }
            return r
          })
        }
        ;(repoToLogin.authentication as FormsAuthenticationService).getCurrentUser()
        settingsManager.setPersonalSettingsValue({ ...personalSettings, repositories })
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
          message: localization.loginSuccessNotification.replace('{0}', userNameParam).replace('{1}', urlParam),
          data: {
            relatedContent: repoToLogin.authentication.currentUser.getValue(),
            relatedRepository: repoToLogin.configuration.repositoryUrl,
          },
        })
        if (match.path === '/login') {
          await sleepAsync(1800)
          const { from } = location.state || { from: { pathname: `/${btoa(repoToLogin.configuration.repositoryUrl)}` } }
          history.replace(from)
        }
      } else {
        setIsInProgress(false)
        setError(localization.loginFailed)
        logger.warning({
          message: localization.loginFailedNotification.replace('{0}', userNameParam).replace('{1}', urlParam),
        })
      }
    } catch (err) {
      logger.error({
        message: localization.loginErrorNotification.replace('{0}', userNameParam).replace('{1}', urlParam),
        data: {
          details: { error: err },
        },
      })
    }
  }

  const handleInvalid = (ev: React.ChangeEvent<HTMLInputElement>) => {
    ev.preventDefault()
    setInputState({
      ...inputState,
      [ev.target.name]: {
        isValid: ev.target.validity.valid,
        errorMessage: ev.target.validationMessage,
      },
    })
  }

  const clearInputError = (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    setInputState({ ...inputState, [ev.target.name]: { isValid: true, errorMessage: '' } })
  }

  const selectDemoUser = (demoUser: DemoUser) => {
    login(demoUser.userName, demoUser.userName, 'https://dev.demo.sensenet.com')
  }

  return (
    <>
      <InfoBox onSelect={selectDemoUser} />
      <Container maxWidth="sm">
        <div className={classes.paper}>
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
              <TextField
                id="username"
                required={true}
                margin="normal"
                name="userName"
                label={localization.userNameLabel}
                helperText={!inputState.userName.isValid ? inputState.userName.errorMessage : ''}
                placeholder={localization.userNameHelperText}
                error={!inputState.userName.isValid}
                fullWidth={true}
                value={userName}
                onInvalid={handleInvalid}
                onChange={ev => {
                  clearInputError(ev)
                  setUserName(ev.target.value)
                }}
                className={classes.loginInput}
              />
              <TextField
                id="password"
                required={true}
                margin="dense"
                name="password"
                label={localization.passwordLabel}
                fullWidth={true}
                type="password"
                error={!inputState.password.isValid}
                helperText={!inputState.password.isValid ? inputState.password.errorMessage : ''}
                placeholder={localization.passwordHelperText}
                onInvalid={handleInvalid}
                value={password}
                onChange={ev => {
                  clearInputError(ev)
                  setPassword(ev.target.value)
                }}
                className={classes.loginInput}
              />
              <TextField
                id="repository"
                margin="dense"
                required={true}
                name="repository"
                label={localization.repositoryLabel}
                error={!inputState.repository.isValid}
                placeholder={localization.repositoryHelperText}
                helperText={!inputState.repository.isValid ? inputState.repository.errorMessage : ''}
                fullWidth={true}
                type="url"
                value={url}
                onInvalid={handleInvalid}
                onChange={ev => {
                  clearInputError(ev)
                  setUrl(ev.target.value)
                }}
                className={classes.loginInput}
              />
              {error ? <Typography style={{ color: theme.palette.error.main }}>{error}</Typography> : null}
              <Button
                aria-label={localization.loginButtonTitle}
                fullWidth={true}
                variant="contained"
                color="primary"
                type="submit">
                <Typography variant="button">{localization.loginButtonTitle}</Typography>
              </Button>
            </form>
          )}
        </div>
      </Container>
    </>
  )
}

export default Login
