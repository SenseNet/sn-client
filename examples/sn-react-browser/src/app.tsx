import React from 'react'
import { Container, CssBaseline, Grid } from '@material-ui/core'
import { Route, Switch } from 'react-router-dom'
import { useRepository } from '@sensenet/hooks-react'
import snLogo from './assets/sensenet_logo_transparent.png'
import { NavBarComponent } from './components/navbar'
import MainPanel from './components/mainpanel'
import DocviewerComponent from './components/document-viewer'
import EditorPage, { EditorPageProps } from './components/document-editor'

/**
 * The main entry point of your app. You can start h@cking from here ;)
 */
export const App: React.FunctionComponent = () => {
  const repo = useRepository()

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
              <Route
                path="/edit/:documentId"
                component={(props: EditorPageProps) => <EditorPage repository={repo} {...props} />}
              />
            </Switch>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
