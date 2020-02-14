import { Button, Container, createStyles, Grid, makeStyles, TextField, Theme, Typography } from '@material-ui/core'
import { useAuthentication, useInjector } from '@sensenet/hooks-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import snLogo from '../../assets/sensenet-icon-32.png'
import { useLocalization, usePersonalSettings } from '../../hooks'
import { PersonalSettings } from '../../services'
import { getAuthService } from '../../services/auth-service'
import { FullScreenLoader } from '../FullScreenLoader'
import { AuthCallback } from './auth-callback'

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

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    personalSettings.lastRepository = url
    settingsManager.setPersonalSettingsValue({ ...personalSettings })
    const service = await getAuthService(url)
    login(`${window.location.origin}/${btoa(url)}`, service)
  }

  return (
    <div>
      {personalSettings.lastRepository ? <AuthCallback repoUrl={personalSettings.lastRepository} /> : null}
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
