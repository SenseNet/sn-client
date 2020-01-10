import React from 'react'
import { Link } from 'react-router-dom'
import { Container, createStyles, Grid, makeStyles, Theme } from '@material-ui/core'
import snLogo from '../../assets/sensenet-icon-32.png'
import { Login } from './Login'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topbar: {
      padding: theme.spacing(1),
    },
  }),
)

export function LoginPage() {
  const classes = useStyles()
  return (
    <div>
      <Grid container={true} direction="row">
        <Container maxWidth="lg" className={classes.topbar}>
          <Link to="/">
            <img src={snLogo} alt="sensenet logo" />
          </Link>
        </Container>
      </Grid>
      <Login />
    </div>
  )
}

export default LoginPage
