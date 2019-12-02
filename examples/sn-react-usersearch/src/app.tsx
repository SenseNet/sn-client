import React from 'react'

// start of material imports
import { Container, CssBaseline, Grid } from '@material-ui/core'
import Toolbar from '@material-ui/core/Toolbar'
// end of material imports

// start of sensenet imports
import snLogo from './assets/sensenet_logo_transparent.png'
// end of materiasensenet imports

// start of component imports
import HeaderPanel from './components/header'
import UserSearch from './components/user-search'
// end of component imports

/**
 * The main entry point of your app. You can start h@cking from here ;)
 */
export const App: React.FunctionComponent = () => {
  // const usr = useCurrentUser()
  // const repo = useRepository()
  return (
    <React.Fragment>
      <CssBaseline />
      <HeaderPanel />
      <Toolbar />
      <Container
        maxWidth="lg"
        style={{
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
        }}>
        <Grid container>
          <Grid item xs={12}>
            <UserSearch />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}
