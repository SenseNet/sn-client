import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  createStyles,
  Grid,
  InputLabel,
  makeStyles,
  TextField,
  TextFieldProps,
  Theme,
  Typography,
} from '@material-ui/core'
import { PathHelper } from '@sensenet/client-utils'
import { clsx } from 'clsx'
import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import snLogo from '../../assets/sensenet_white.png'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
      height: globals.common.headerHeight,
      backgroundColor:
        theme.palette.type === 'dark' ? globals.common.headerBackground : globals.common.headerLightBackground,
      boxShadow: 'none',
    },
    loginSubtitle: {
      marginBottom: '1em',
    },
    input: {
      paddingTop: '10px',
      paddingBottom: '10px',

      '&:-webkit-autofill': {
        WebkitBoxShadow: 'unset',
        WebkitTextFillColor: 'unset',
        caretColor: 'unset',
      },
    },
  }),
)

const DEVDEMO_URL = `https://dev.demo.sensenet.com`

type LoginPageProps = {
  handleSubmit: (url: string) => void
  isLoginInProgress: boolean
}

export default function LoginPage({ handleSubmit, isLoginInProgress }: LoginPageProps) {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const localization = useLocalization().login
  const loginUrlInputField = useRef<TextFieldProps>(null)

  const handleOnSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()

    const url = loginUrlInputField.current?.value as string

    handleSubmit(PathHelper.ensureDefaultSchema(url))
  }

  const handleDemoSubmit = () => {
    handleSubmit(DEVDEMO_URL)
  }

  return (
    <>
      <AppBar position="sticky" className={clsx(globalClasses.centeredHorizontal, classes.appBar)}>
        <Grid container direction="row">
          <Grid item xs={1}>
            <Grid container style={{ paddingLeft: '16px', paddingTop: '4px' }}>
              <Link to="/">
                <img src={snLogo} alt="sensenet logo" style={{ height: '32px', marginTop: '1px' }} />
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </AppBar>
      <Container maxWidth="sm">
        <Grid container direction="column">
          <Grid container direction="column" justify="center" style={{ flexBasis: 150 }}>
            <Typography align="center" variant="h4" component="p">
              {localization.welcome}
            </Typography>
          </Grid>
          <Grid container direction="column" justify="center" alignItems="center" style={{ flexBasis: 150 }}>
            <Grid item>
              <Typography align="center" variant="subtitle1" component="p">
                {localization.demoTitle}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                onClick={handleDemoSubmit}
                size="medium"
                aria-label={localization.loginToDemoButtonTitle}
                disabled={isLoginInProgress}
                variant="contained"
                color="secondary">
                {localization.loginToDemoButtonTitle}
                {isLoginInProgress && <CircularProgress size={14} />}
              </Button>
            </Grid>
          </Grid>
          <Grid item>
            <form onSubmit={handleOnSubmit}>
              <Typography align="center" variant="subtitle1" component="p" className={classes.loginSubtitle}>
                {localization.repositoryUrl}
              </Typography>
              <InputLabel shrink htmlFor="repository" required={true} style={{ marginBottom: '0.5rem' }}>
                {localization.repositoryLabel}
              </InputLabel>
              <TextField
                required={true}
                name="repository"
                disabled={isLoginInProgress}
                variant="outlined"
                placeholder={localization.repositoryHelperText}
                fullWidth={true}
                type="text"
                inputRef={loginUrlInputField}
                inputProps={{
                  className: classes.input,
                }}
                style={{ paddingBottom: 30 }}
              />
              <Button
                aria-label={localization.loginButtonTitle}
                fullWidth={true}
                disabled={isLoginInProgress}
                variant="contained"
                color="primary"
                type="submit">
                {localization.loginButtonTitle}
                {isLoginInProgress && <CircularProgress size={14} />}
              </Button>
            </form>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
