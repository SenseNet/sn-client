import { UniversalHeader } from '@sensenet/universal-header-react'
import { Button, Container, createStyles, CssBaseline, Grid, makeStyles, Theme } from '@material-ui/core'
import React from 'react'
import snLogo from './assets/sensenet_logo_transparent.png'
import UserSearch from './components/user-search'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      minHeight: '90vh',
      display: 'flex',
      verticalAlign: 'middle',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      flexDirection: 'column',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url(${snLogo})`,
      backgroundSize: 'auto',
    },
    button: {
      backgroundColor: '#7169f4',
      color: `${theme.palette.common.white} !important`,
      borderRadius: '26px',
      padding: '10px 20px',
      margin: '40px 0',
      height: '44px',
      '&:hover': {
        backgroundColor: '#5e58cc',
      },
      textTransform: 'uppercase',
    },
  }),
)
/**
 * The main entry point of your app. You can start h@cking from here ;)
 */
export const App: React.FunctionComponent = () => {
  const classes = useStyles()

  return (
    <React.Fragment>
      <CssBaseline />
      <UniversalHeader title="User search" appName="sn-react-usersearch" />
      <Container maxWidth="lg" className={classes.container}>
        <Button href="https://admin.sensenet.com/users-and-groups/explorer/" target="_blank" className={classes.button}>
          Go to connected repository
        </Button>
        <Grid container>
          <Grid item xs={12}>
            <UserSearch />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}
