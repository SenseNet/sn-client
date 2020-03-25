import { Button, Container, createStyles, Grid, makeStyles, TextField, Theme, Typography } from '@material-ui/core'
import React, { useState } from 'react'
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

export default function LoginPage(props: { handleSubmit: (repoUrl: string) => void }) {
  const classes = useStyles()
  const localization = useLocalization().login
  const [url, setUrl] = useState('')

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    props.handleSubmit(url)
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
      </Container>
    </>
  )
}
