import { Container, CssBaseline, Grid } from '@material-ui/core'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import snLogo from './assets/sensenet_logo_transparent.png'
import { DocumentEditor } from './components/document-editor'
import DocviewerComponent from './components/document-viewer'
import MainPanel from './components/mainpanel'
import { NavBarComponent } from './components/navbar'

/**
 * The main entry point of your app. You can start h@cking from here ;)
 */
export const App: React.FunctionComponent = () => {
  return (
    <>
      <CssBaseline />
      <NavBarComponent />
      <Container
        maxWidth="lg"
        style={{
          width: '100%',
          minHeight: '80vh',
          display: 'flex',
          marginTop: '10px',
          verticalAlign: 'middle',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'column',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url(${snLogo})`,
          backgroundSize: 'auto',
        }}>
        <Grid container>
          <Grid item xs={12}>
            <Switch>
              <Route path="/" exact component={MainPanel} />
              <Route path="/preview/:documentId" component={DocviewerComponent} />
              <Route path="/edit/:documentId/:action?" component={DocumentEditor} />
            </Switch>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
