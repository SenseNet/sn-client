import { Button, Container, createStyles, CssBaseline, Grid, makeStyles, Theme } from '@material-ui/core'
import { useRepository } from '@sensenet/hooks-react'
import { UniversalHeader } from '@sensenet/universal-header-react'
import React from 'react'
import snLogo from './assets/sensenet_logo_transparent.png'
import MainPanel from './components/mainpanel'
import SharedProvider from './context/shared-context'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      minHeight: '80vh',
      display: 'flex',
      marginTop: '65px',
      verticalAlign: 'middle',
      alignItems: 'center',
      justifyContent: 'flex-start',
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
  const repo = useRepository()
  repo.reloadSchema()

  return (
    <>
      <CssBaseline />
      <UniversalHeader title="Calendar" appName="sn-react-calendar" />
      <Container maxWidth="lg" className={classes.container}>
        <Button
          href="https://admin.sensenet.com/content/explorer/?path=%2FIT%2FCalendar"
          target="_blank"
          className={classes.button}>
          Go to connected repository
        </Button>
        <Grid container direction="column" justify="center">
          <Grid item xs={12} style={{ alignSelf: 'center' }}>
            <SharedProvider>
              <MainPanel />
            </SharedProvider>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
