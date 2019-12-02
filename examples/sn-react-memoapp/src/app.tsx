import React from 'react'
import { Container, CssBaseline, Grid } from '@material-ui/core'
import Toolbar from '@material-ui/core/Toolbar'
import snLogo from './assets/sensenet_logo_transparent.png'
import { NavBarComponent } from './components/navbar'
import { MemoPanel } from './components/memo-panel'

/**
 * The main entry point of your app. You can start h@cking from here ;)
 */
export const App: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <NavBarComponent />
      <Toolbar />
      <Container
        maxWidth="lg"
        style={{
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
        }}>
        <Grid container>
          <Grid item xs={12}>
            <MemoPanel />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}
