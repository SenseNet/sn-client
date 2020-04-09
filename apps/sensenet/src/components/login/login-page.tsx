import { Button, Container, createStyles, Grid, makeStyles, TextField, Theme } from '@material-ui/core'
import { debounce } from '@sensenet/client-utils'
import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import snLogo from '../../assets/sensenet-icon-32.png'
import { useLocalization } from '../../hooks'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topbar: {
      padding: theme.spacing(1),
    },
  }),
)

type LoginPageProps = {
  handleSubmit?: () => void
  inputChangeCallback?: (url: string) => void
  url?: string
  isLoginDisabled: boolean
}

export default function LoginPage(props: LoginPageProps) {
  const classes = useStyles()
  const localization = useLocalization().login

  const debounced = useCallback(
    debounce((text: string) => {
      try {
        new URL(text)
        console.log(text)
        props.inputChangeCallback?.(text)
      } catch {
        return
      }
    }, 2000),
    [],
  )

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    props.handleSubmit?.()
  }

  return (
    <>
      <Grid container={true} direction="row">
        <Container maxWidth="lg" className={classes.topbar}>
          <Link to="/">
            <img src={snLogo} alt="sensenet logo" />
          </Link>
        </Container>
      </Grid>
      <Container maxWidth="sm">
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
            value={props.url}
            onChange={(ev) => {
              debounced(ev.target.value)
            }}
          />
          <Button
            aria-label={localization.loginButtonTitle}
            fullWidth={true}
            variant="contained"
            disabled={props.isLoginDisabled}
            color="primary"
            type="submit">
            {localization.loginButtonTitle}
          </Button>
        </form>
      </Container>
    </>
  )
}
