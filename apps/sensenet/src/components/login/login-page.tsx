import { Button, Container, createStyles, Grid, makeStyles, TextField, Theme, Typography } from '@material-ui/core'
import { OidcRoutes, useAuthentication, useInjector } from '@sensenet/hooks-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { OIDCAuthenticationService, Repository } from '@sensenet/client-core'
import snLogo from '../../assets/sensenet-icon-32.png'
import { useLocalization, usePersonalSettings } from '../../hooks'
import { PersonalSettings, useRepoState } from '../../services'
import { FullScreenLoader } from '../FullScreenLoader'
import { getAuthService } from '../../services/auth-service'
import { applicationPaths } from '../../application-paths'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topbar: {
      padding: theme.spacing(1),
    },
  }),
)

export function LoginPage() {
  const classes = useStyles()
  const injector = useInjector()
  const personalSettings = usePersonalSettings()
  const settingsManager = injector.getInstance(PersonalSettings)
  const localization = useLocalization().login
  const { login, isLoading } = useAuthentication()
  const [url, setUrl] = useState('')
  const [authService, setAuthService] = useState<OIDCAuthenticationService>()
  const { addRepository } = useRepoState()

  useEffect(() => {
    async function fetchAuthService() {
      if (!personalSettings.lastRepository) {
        return
      }
      const service = await getAuthService(personalSettings.lastRepository)
      setAuthService(service)
    }
    fetchAuthService()
  }, [personalSettings.lastRepository])

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    personalSettings.lastRepository = url
    settingsManager.setPersonalSettingsValue({ ...personalSettings })
    const service = await getAuthService(url)
    login(`${window.location.origin}/${btoa(url)}`, service)
  }

  const loginSuccessCallback = async (returnUrl: string) => {
    if (!authService) {
      console.log('no auth service available')
      return
    }
    const accessToken = await authService.getAccessToken()
    addRepository({
      currentUser: { Name: 'Admin' } as any,
      isActive: true,
      isOnline: true,
      repository: new Repository({ repositoryUrl: personalSettings.lastRepository, token: accessToken }),
    })
    window.location.replace(returnUrl)
  }

  return (
    <div>
      {authService ? (
        <OidcRoutes
          authService={authService}
          loginCallback={{ successCallback: loginSuccessCallback, url: applicationPaths.loginCallback }}
          logoutCallback={{ url: applicationPaths.logOutCallback }}
        />
      ) : null}
      <Grid container={true} direction="row">
        <Container maxWidth="lg" className={classes.topbar}>
          <Link to="/">
            <img src={snLogo} alt="sensenet logo" />
          </Link>
        </Container>
      </Grid>
      <Container maxWidth="sm">
        {isLoading ? (
          <div>
            <FullScreenLoader />
            <p>Login is in progress</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              id="repository"
              margin="dense"
              required={true}
              name="repository"
              label={localization.repositoryLabel}
              placeholder={localization.repositoryHelperText}
              fullWidth={true}
              type="url"
              value={url}
              onChange={ev => {
                setUrl(ev.target.value)
              }}
            />
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
      </Container>
    </div>
  )
}
