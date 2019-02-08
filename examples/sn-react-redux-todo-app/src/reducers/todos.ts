import { Repository } from '@sensenet/client-core'
import { Status, Task } from '@sensenet/default-content-types'
import { Query } from '@sensenet/query'
import { AnyAction } from 'redux'
import { rootStateType } from '..'

export const fetch = () => ({
  type: 'FETCH_TASKS',
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    if (!options.getState().todoList.isFetching) {
      options.dispatch(startFetching())
      try {
        const todos = await options.getInjectable(Repository).loadCollection<Task>({
          path: '/Root/Sites/Default_Site/tasks',
          oDataOptions: {
            query: new Query(q => q.typeIs(Task)).toString(),
            select: ['Status', 'Name', 'DisplayName'],
          },
        })
        options.dispatch(finishFetching(todos.d.results))
      } catch (error) {
        options.dispatch(fetchingError(error))
      }
      options.dispatch(updateFilter())
    }
  },
})

export const updateTodo = (todo: Task) => ({
  type: 'UPDATE_TODO',
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    try {
      const updated = await options.getInjectable(Repository).patch<Task>({
        idOrPath: todo.Id,
        content: todo,
        oDataOptions: {
          select: ['Status', 'Name', 'DisplayName'],
        },
      })
      options.dispatch(todoUpdated(updated.d))
    } catch (error) {
      options.dispatch(fetchingError(error))
    }
    options.dispatch(updateFilter())
  },
})

export const todoUpdated = (todo: Task) => ({
  type: 'TODO_UPDATED',
  todo,
})

export const removeTodo = (todo: Task) => ({
  type: 'UPDATE_TODO',
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    try {
      const result = await options.getInjectable(Repository).delete({
        idOrPath: todo.Id,
      })
      options.dispatch(todoRemoved(result.d.results[0]))
    } catch (error) {
      options.dispatch(fetchingError(error))
    }
    options.dispatch(updateFilter())
  },
})

export const todoRemoved = (todo: Task) => ({
  type: 'TODO_REMOVED',
  todo,
})

export const startFetching = () => ({
  type: 'START_FETCHING',
})

export const finishFetching = (tasks: Task[]) => ({
  type: 'FINISH_FETCHING',
  tasks,
})

export const fetchingError = (error: Error) => ({
  type: 'FETCHING_ERROR',
  error,
})

export const updateFilter = (filter?: Status) => ({
  type: 'UPDATE_FILTER',
  filter,
})

export const selectTask = (id?: number) => ({
  type: 'SELECT_TASK',
  id,
})

export interface TaskListType {
  allTasks: Task[]
  filter: Status | 'all'
  visibleTasks: Task[]
  isFetching: boolean
  error?: Error
  selected?: Task
}

export const todoListReducer = (
  state: TaskListType = {
    isFetching: false,
    allTasks: [],
    visibleTasks: [],
    filter: 'all',
  },
  action: AnyAction,
) => {
  switch (action.type) {
    case 'START_FETCHING':
      return { ...state, isFetching: true }
    case 'FINISH_FETCHING':
      return { ...state, isFetching: false, allTasks: (action as ReturnType<typeof finishFetching>).tasks }
    case 'FETCHING_ERROR':
      return { ...state, isFetching: false, error: (action as ReturnType<typeof fetchingError>).error }
    case 'UPDATE_FILTER':
      const filter = (action as ReturnType<typeof updateFilter>).filter || state.filter || 'all'
      return {
        ...state,
        filter,
        visibleTasks: filter
          ? state.allTasks.filter(
              t => filter === ('all' as Status) || t.Status === filter || t.Status.indexOf(filter) > -1,
            )
          : state.allTasks,
      }
    case 'TODO_UPDATED': {
      const updateAction = action as ReturnType<typeof todoUpdated>
      return {
        ...state,
        allTasks: state.allTasks.map(t => {
          if (t.Id === updateAction.todo.Id) {
            return updateAction.todo
          }
          return t
        }),
      }
    }
    case 'TODO_REMOVED':
      const a = action as ReturnType<typeof todoRemoved>
      return {
        ...state,
        allTasks: state.allTasks.filter(t => t.Id !== a.todo.Id),
      }
    case 'SELECT_TASK':
      return {
        ...state,
        selected: state.allTasks.find(t => t.Id === (action as ReturnType<typeof selectTask>).id),
      }
  }
  return state
}
