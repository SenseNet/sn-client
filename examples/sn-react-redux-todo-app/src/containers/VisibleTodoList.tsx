import CircularProgress from '@material-ui/core/CircularProgress'
import { ODataParams } from '@sensenet/client-core'
import { Task } from '@sensenet/default-content-types'
import { Actions } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import { FetchError } from '../components/FetchError'
import { TodoList } from '../components/TodoList'
import { getErrorMessage, getIsFetching, getVisibilityFilter, getVisibleTodos } from '../reducers/filtering'

export interface VisibleTodoListProps {
  onTodoClick
  onDeleteClick
  collection: Task[]
  path: string
  options: ODataParams<Task>
  filter
  fetchTodos
  requestTodos
  isFetching: false
  visibilityFilter: any
  errorMessage: any
  repository
}

const styles = {
  loader: {
    margin: '0 auto',
  },
}

class VisibleTodoList extends React.Component<VisibleTodoListProps, {}> {
  constructor(props) {
    super(props)
  }
  public componentDidMount() {
    this.fetchData(this.props.filter)
  }
  public componentDidUpdate(prevOps) {
    if (this.props.filter !== prevOps.filter) {
      this.fetchData(this.props.filter)
    }
    // tslint:disable-next-line:no-string-literal
    if (this.props.collection && this.props.collection.length > prevOps.collection.length) {
      this.fetchData(this.props.filter)
    }
  }
  public fetchData(filter) {
    const { path, fetchTodos } = this.props
    const optionObj = {
      select: 'all',
    }
    if (filter === 'Active') {
      // tslint:disable-next-line:no-string-literal
      optionObj['filter'] = `isOf('Task') and Status eq %27Active%27`
    } else if (filter === 'Completed') {
      // tslint:disable-next-line:no-string-literal
      optionObj['filter'] = `isOf('Task') and Status eq %27Completed%27`
    } else {
      // tslint:disable-next-line:no-string-literal quotemark
      optionObj['filter'] = "isOf('Task')"
    }
    fetchTodos(path, optionObj, Task)
  }
  public render() {
    if (this.props.isFetching && this.props.collection.length > 0) {
      return (
        <div style={styles.loader}>
          <CircularProgress />
        </div>
      )
    }
    if (this.props.errorMessage && this.props.collection.length > 0) {
      return <FetchError message={this.props.errorMessage} onRetry={() => this.fetchData(this.props.filter)} />
    }
    return (
      <TodoList
        collection={this.props.collection}
        onTodoClick={this.props.onTodoClick}
        onDeleteClick={this.props.onDeleteClick}
      />
    )
  }
}

const mapStateToProps = (state, params) => {
  const filter = state.listByFilter.VisibilityFilter || 'All'
  const url = '/Root/Sites/Default_Site/tasks'
  return {
    collection: getVisibleTodos(state, filter),
    errorMessage: getErrorMessage(state, filter),
    isFetching: getIsFetching(state, filter),
    visibilityFilter: getVisibilityFilter(state),
    filter,
    path: params.path || url,
  }
}

const toggleTodoAction = Actions.updateContent
const deleteTodoAction = Actions.deleteContent
const fetchTodosAction = Actions.requestContent

const visibleTodoLista = connect(
  mapStateToProps,
  {
    onTodoClick: toggleTodoAction,
    onDeleteClick: deleteTodoAction,
    fetchTodos: fetchTodosAction,
  },
)(VisibleTodoList as any)

export default visibleTodoLista
