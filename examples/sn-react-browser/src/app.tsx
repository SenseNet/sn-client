import { HEADER_HEIGHT, UniversalHeader } from '@sensenet/universal-header-react'
import { Button, Container, createStyles, CssBaseline, Grid, makeStyles, Theme } from '@material-ui/core'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import snLogo from './assets/sensenet_logo_transparent.png'
import { DocumentEditor } from './components/document-editor'
import DocviewerComponent from './components/document-viewer'
import MainPanel from './components/mainpanel'

const GOTOREPO_BUTTON_HEIGHT = 44
const GOTOREPO_BUTTON_MARGIN_Y = 40

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      display: 'flex',
      height: `calc(100% - ${HEADER_HEIGHT})`,
      position: 'relative',
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
      margin: `${GOTOREPO_BUTTON_MARGIN_Y}px 0`,
      height: `${GOTOREPO_BUTTON_HEIGHT}px`,
      '&:hover': {
        backgroundColor: '#5e58cc',
      },
      textTransform: 'uppercase',
    },
    gridContainer: {
      height: `calc(100% - ${GOTOREPO_BUTTON_HEIGHT + 2 * GOTOREPO_BUTTON_MARGIN_Y}px)`,
      position: 'relative',
    },
    gridItem: {
      height: '100%',
    },
  }),
)

/**
 * The main entry point of your app. You can start h@cking from here ;)
 */
export const App: React.FunctionComponent = () => {
  const classes = useStyles()

  return (
    <>
      <CssBaseline />
      <UniversalHeader title="Document Browser" appName="sn-react-browser" />
      <Container maxWidth="lg" className={classes.container}>
        <Button
          target="_blank"
          href="https://admin.sensenet.com/content/explorer/?path=%2FIT%2FDocument_Library"
          className={classes.button}>
          Go to connected repository
        </Button>
        <Grid container className={classes.gridContainer}>
          <Grid item xs={12} className={classes.gridItem}>
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
