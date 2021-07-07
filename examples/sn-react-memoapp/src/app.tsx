import { UniversalHeader } from '@sensenet/universal-header-react'
import { Button, Container, createStyles, CssBaseline, Grid, makeStyles, Theme } from '@material-ui/core'
import Toolbar from '@material-ui/core/Toolbar'
import React from 'react'
import snLogo from './assets/sensenet_logo_transparent.png'
import { MemoPanel } from './components/memo-panel'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      minHeight: '90vh',
      marginTop: '10px',
      display: 'flex',
      verticalAlign: 'middle',
      alignItems: 'center',
      justifyContent: 'center',
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
      marginBottom: '40px',
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
      <UniversalHeader title="Memo application" appName="sn-react-memoapp" />
      <Toolbar />
      <Container maxWidth="lg" className={classes.container}>
        <Button
          href="https://admin.sensenet.com/content/explorer/?path=%2FIT%2FMemos"
          target="_blank"
          className={classes.button}>
          Go to connected repository
        </Button>
        <Grid container>
          <Grid item xs={12}>
            <MemoPanel />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}
