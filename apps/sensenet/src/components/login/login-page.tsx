import { PathHelper } from '@sensenet/client-utils'
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
  Typography,
} from '@material-ui/core'
import clsx from 'clsx'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import snLogo from '../../assets/sensenet-icon-32.png'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'

const useStyles = makeStyles(() =>
  createStyles({
    appBar: {
      position: 'relative',
      height: globals.common.headerHeight,
      backgroundColor: globals.common.headerBackground,
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
  const [url, setUrl] = useState('')
  const localization = useLocalization().login
  const validUrl = new RegExp('^http[s]?:[/]{2}')
  const stripPrefix = new RegExp('^.*[:]?[/]{1,2}')
  const splitStr = ':/'

  const handleOnSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    handleSubmit(PathHelper.trimSlashes(url))
  }

  const handleDemoSubmit = () => {
    handleSubmit(DEVDEMO_URL)
  }

  return (
    <>
      <AppBar position="sticky" className={clsx(globalClasses.centeredHorizontal, classes.appBar)}>
        <Grid container direction="row">
          <Grid item xs={1}>
            <Grid container justify="flex-end">
              <Link to="/">
                <img src={snLogo} alt="sensenet logo" />
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
                type="url"
                value={url}
                inputProps={{
                  className: classes.input,
                }}
                onChange={(ev) => {
                  // const schValue = ev.target.value.startsWith('http://') ? ev.target.value : `https://${ev.target.value}`
                  const schValue =
                    validUrl.test(ev.target.value) || ev.target.value === ''
                      ? ev.target.value
                      : `https://${ev.target.value.replace(stripPrefix, '')}`
                  console.log(ev.target.value, ev.target.value.indexOf(splitStr), splitStr, splitStr.length)
                  setUrl(schValue)
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
