import CircularProgress from '@material-ui/core/CircularProgress'
import { LoginState } from '@sensenet/client-core'
import { EditView, NewView } from '@sensenet/controls-react'
import { Task } from '@sensenet/default-content-types'
import { Actions, Reducers } from '@sensenet/redux'
import React from 'react'
import { connect } from 'react-redux'
import { HashRouter as Router, Route } from 'react-router-dom'
import { rootStateType, repository } from '..'

import LoginView from '../containers/Login'
import VisibleTodoList from '../containers/VisibleTodoList'
import { fetch } from '../reducers/todos'
import { FilterMenu } from './FilterMenu'
import { Menu } from './Menu'

const styles = {
  loader: {
    textAlign: 'center',
  },
}

const mapStateToProps = (state: rootStateType) => {
  return {
    loginState: Reducers.getAuthenticationStatus(state.sensenet),
    schema: Reducers.getSchema(state.sensenet),
    selected: state.todoList.selected,
  }
}

const mapDispatchToProps = {
  loginClick: Actions.userLogin,
  editSubmitClick: Actions.updateContent,
  createSubmitClick: Actions.createContent,
  getSchema: Actions.getSchema,
  fetch,
}

interface AppState {
  content: Task
  loginState: LoginState
  listView: () => JSX.Element
  newView: () => JSX.Element
  editView: () => JSX.Element
  name: string
  password: string
}

class App extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, AppState> {
  constructor(props) {
    super(props)
    this.state = {
      // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
      content: { Status: 'active' as any, Path: '/Root/Sites/Default_Site/tasks', Type: 'Task' } as Task,
      // params: this.props,
      loginState: LoginState.Pending,
      name: '',
      password: '',
      listView: () => {
        return (
          <div>
            <h4>Todos</h4>
            <FilterMenu />
            <VisibleTodoList />
          </div>
        )
      },
      newView: () => (
        <NewView
          path={this.state.content.Path}
          contentTypeName={'Task'}
          repository={repository}
          onSubmit={this.props.createSubmitClick}
          schema={this.props.schema}
        />
      ),
      editView: () => {
        if (this.props.selected) {
          return (
            <EditView
              content={this.props.selected}
              contentTypeName="Task"
              onSubmit={this.props.editSubmitClick}
              repository={repository}
              schema={this.props.schema}
            />
          )
        } else {
          return null
        }
      },
    }
    this.props.getSchema('Task')
  }
  /**
   * render
   */
  public render() {
    const { loginState } = this.props
    const isLoggedin = loginState === LoginState.Authenticated
    const isPending = loginState === LoginState.Pending
    const { listView, editView, newView } = this.state
    if (isLoggedin) {
      this.props.fetch()
      return (
        <Router>
          <div>
            <Route exact={true} path="/" component={listView} />
            <Route path="/edit/:id" component={editView} />
            <Route path="/new/:type" component={newView} />
            <Route path="/browse/:filter" component={listView} />
            <Menu />
          </div>
        </Router>
      )
    } else if (isPending) {
      return (
        <div style={styles.loader as any}>
          <CircularProgress />
        </div>
      )
    } else {
      return (
        <div>
          <LoginView />
        </div>
      )
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App as any)
