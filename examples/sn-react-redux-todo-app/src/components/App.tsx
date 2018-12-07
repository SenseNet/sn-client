import CircularProgress from '@material-ui/core/CircularProgress'
import { LoginState } from '@sensenet/client-core'
import { EditView, NewView } from '@sensenet/controls-react'
import { Schema, Task } from '@sensenet/default-content-types'
import { Actions, Reducers } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from '../containers/Login'
import VisibleTodoList from '../containers/VisibleTodoList'
import { FilterMenu } from './FilterMenu'
import { Menu } from './Menu'

const styles = {
  loader: {
    textAlign: 'center',
  },
}

interface AppProps {
  loginState
  store
  repository
  filter
  editSubmitClick
  createSubmitClick
  id: number
  schema: Schema
  getSchema
}

interface AppState {
  content
  params
  loginState
  listView
  newView
  editView
  name
  password
}

class App extends React.Component<AppProps, AppState> {
  constructor(props) {
    super(props)
    this.state = {
      content: { Status: 'active' as any, Path: '/Root/Sites/Default_Site/tasks', Type: 'Task' } as Task,
      params: this.props,
      loginState: LoginState.Pending,
      name: '',
      password: '',
      listView: () => {
        return (
          <div>
            <h4>Todos</h4>
            <FilterMenu />
            <VisibleTodoList params={true} repository={this.props.repository} />
          </div>
        )
      },
      newView: () => (
        <NewView
          path={this.state.content.Path}
          contentTypeName={'Task'}
          repository={this.props.repository}
          onSubmit={this.props.createSubmitClick}
          schema={this.props.schema}
        />
      ),
      editView: ({ match }) => {
        const selectedContent = Reducers.getContent(this.props.store.sensenet.children.entities, match.params.id)
        const content = selectedContent as Task
        if (content) {
          return (
            <EditView
              content={content}
              contentTypeName="Task"
              onSubmit={this.props.editSubmitClick}
              repository={this.props.repository}
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
    const { listView, editView, newView, name, password } = this.state
    if (isLoggedin) {
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
          <Login props={{ name, password, repository: this.props.repository }} />
        </div>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    loginState: Reducers.getAuthenticationStatus(state.sensenet),
    store: state,
    schema: Reducers.getSchema(state.sensenet),
  }
}

const userLogin = Actions.userLogin
const update = Actions.updateContent
const create = Actions.createContent
const getSchema = Actions.getSchema

export default connect(
  mapStateToProps,
  {
    loginClick: userLogin,
    editSubmitClick: update,
    createSubmitClick: create,
    getSchema,
  },
)(App as any)
