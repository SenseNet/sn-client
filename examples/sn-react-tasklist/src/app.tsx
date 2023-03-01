import { Button, Container, createStyles, CssBaseline, Grid, makeStyles, Theme } from '@material-ui/core'
import { UniversalHeader } from '@sensenet/universal-header-react'
import React from 'react'
import TodoListPanel from './components/todo-list'

const useHeaderStyles = makeStyles(() =>
  createStyles({
    appBar: {
      backgroundColor: '#019592',
    },
  }),
)

const useHamburgerMenuStyles = makeStyles(() =>
  createStyles({
    menuIcon: {
      '&:hover': {
        color: '#C8FFF4',
      },
    },
    menuIconActive: {
      color: '#C8FFF4',
    },
    menuItem: {
      '&:hover': {
        color: '#13a5ad',
      },
    },
  }),
)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  const headerStyle = useHeaderStyles()
  const hamburgerMenuStyle = useHamburgerMenuStyles()
  const classes = useStyles()

  return (
    <React.Fragment>
      <CssBaseline />
      <UniversalHeader
        title="To Do App"
        classes={headerStyle}
        hamburgerMenuClasses={hamburgerMenuStyle}
        appName="sn-react-tasklist"
      />

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
        }}>
        <Button
          href="https://admin.sensenet.com/content/explorer/?path=%2FIT%2FTasks"
          target="_blank"
          className={classes.button}>
          Go to connected repository
        </Button>
        <Grid container>
          <Grid item xs={12}>
            <TodoListPanel />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}
