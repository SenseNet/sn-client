import CircularProgress from '@material-ui/core/CircularProgress'
import { ODataParams } from '@sensenet/client-core'
import { Status, Task } from '@sensenet/default-content-types'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '..'
import { FetchError } from '../components/FetchError'
import { TodoList } from '../components/TodoList'
import { fetch, removeTodo, updateFilter, updateTodo } from '../reducers/todos'

const mapStateToProps = (state: rootStateType) => {
  return {
    visibleTasks: state.todoList.visibleTasks,
    errorMessage: state.todoList.error,
    isFetching: state.todoList.isFetching,
    visibilityFilter: state.todoList.filter,
  }
}

const mapDispatchToProps = {
  onTodoClick: updateTodo,
  onDeleteClick: removeTodo,
  fetchTodos: fetch,
  updateFilter,
}

export interface VisibleTodoListProps {
  path: string
  options: ODataParams<Task>
  filter: Status
  isFetching: false
  visibilityFilter: any
  errorMessage: any
}

const styles = {
  loader: {
    margin: '0 auto',
  },
}

class VisibleTodoList extends React.Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & VisibleTodoListProps,
  {}
> {
  constructor(props) {
    super(props)
  }
  public componentDidMount() {
    this.fetchData(this.props.filter)
  }
  public fetchData(filter: Status) {
    this.props.fetchTodos()
    this.props.updateFilter(filter)
  }
  public render() {
    if (this.props.isFetching && this.props.visibleTasks.length > 0) {
      return (
        <div style={styles.loader}>
          <CircularProgress />
        </div>
      )
    }
    if (this.props.errorMessage && this.props.visibleTasks.length > 0) {
      return <FetchError message={this.props.errorMessage} onRetry={() => this.fetchData(this.props.filter)} />
    }
    return (
      <TodoList
        collection={this.props.visibleTasks}
        onTodoClick={this.props.onTodoClick}
        onDeleteClick={this.props.onDeleteClick}
      />
    )
  }
}

const visibleTodoLista = connect(
  mapStateToProps,
  mapDispatchToProps,
)(VisibleTodoList as any)

export default visibleTodoLista
