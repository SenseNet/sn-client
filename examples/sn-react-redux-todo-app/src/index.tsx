import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import { Repository } from '@sensenet/client-core'
import { Reducers, Store } from '@sensenet/redux'
import { combineReducers } from 'redux'

import lightBlue from '@material-ui/core/colors/lightBlue'
import pink from '@material-ui/core/colors/pink'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { JwtService } from '@sensenet/authentication-jwt'
import { Provider } from 'react-redux'
import { ReduxDiMiddleware } from 'redux-di-middleware'
import { todoListReducer } from './reducers/todos'
import { Root } from './components/Root'

const muiTheme = createMuiTheme({
  palette: {
    primary: lightBlue,
    secondary: pink,
  },
  typography: {
    useNextVariants: true,
  },
})

const sensenet = Reducers.sensenet
const myReducer = combineReducers({
  sensenet,
  todoList: todoListReducer,
})
export type rootStateType = ReturnType<typeof myReducer>

export const repository = new Repository({
  repositoryUrl: 'https://dmsservice.demo.sensenet.com',
})

export const jwt = JwtService.setup(repository)

const di = new ReduxDiMiddleware()
di.setInjectable(repository)

const store = Store.createSensenetStore({
  repository,
  rootReducer: myReducer,
  logger: true,
  middlewares: [di.getMiddleware()],
})
ReactDOM.render(
  <MuiThemeProvider theme={muiTheme}>
    <Provider store={store}>
      <Root />
    </Provider>
  </MuiThemeProvider>,

  document.getElementById('root') as HTMLElement,
)
