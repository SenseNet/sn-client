import { UniversalHeader } from '@sensenet/universal-header-react'
import { Container, createStyles, CssBaseline, Grid, makeStyles, Toolbar } from '@material-ui/core'
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
  }),
)

/**
 * The main entry point of your app. You can start h@cking from here ;)
 */
export const App: React.FunctionComponent = () => {
  const headerStyle = useHeaderStyles()
  const hamburgerMenuStyle = useHamburgerMenuStyles()

  return (
    <React.Fragment>
      <CssBaseline />
      <UniversalHeader
        title="To Do App"
        classes={headerStyle}
        hamburgerMenuClasses={hamburgerMenuStyle}
        name="sn-react-tasklist"
      />
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
        }}>
        <Grid container>
          <Grid item xs={12}>
            <TodoListPanel />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}
