import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { Task } from '@sensenet/default-content-types'
import React from 'react'
import { Todo } from './Todo'

const style = {
  emptyList: {
    marginTop: '20px',
    textAlign: 'center',
  },
}

export interface TodoListProps {
  collection: TodoListItem[]
  onTodoClick: (todo: Task) => void
  onDeleteClick: (todo: Task) => void
}

type TodoListItem = Task

export class TodoList extends React.Component<TodoListProps, {}> {
  public render() {
    if (this.props.collection.length > 0) {
      return (
        <List>
          {this.props.collection.map((content, index) => {
            const c = content as Task
            return c !== undefined ? (
              <ListItem key={c.Name + index}>
                <Todo
                  key={c.Id + index}
                  content={c}
                  onClick={t => this.props.onTodoClick(t)}
                  onDeleteClick={t => this.props.onDeleteClick(t)}
                />
              </ListItem>
            ) : null
          })}
        </List>
      )
    } else {
      return <div style={style.emptyList as any}>Add a task first!</div>
    }
  }
}
