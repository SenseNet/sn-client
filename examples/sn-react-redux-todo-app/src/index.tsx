import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Root } from './components/Root'
import './index.css'

import { Repository } from '@sensenet/client-core'
import { Reducers, Store } from '@sensenet/redux'
import { combineReducers } from 'redux'
import { listByFilter } from './reducers/filtering'

import lightBlue from '@material-ui/core/colors/lightBlue'
import pink from '@material-ui/core/colors/pink'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'

const muiTheme = createMuiTheme({
  palette: {
    primary: lightBlue,
    secondary: pink,
  },
})

const sensenet = Reducers.sensenet
const myReducer = combineReducers({
  sensenet,
  listByFilter,
})

const repository = new Repository({
  repositoryUrl: 'https://dmsservice.demo.sensenet.com',
})

const options = {
  repository,
  rootReducer: myReducer,
  logger: true,
} as Store.CreateStoreOptions<any>

const store = Store.createSensenetStore(options)
export type rootStateType = ReturnType<typeof myReducer>

ReactDOM.render(
  <MuiThemeProvider theme={muiTheme}>
    <Root store={store} repository={repository} />
  </MuiThemeProvider>,
  document.getElementById('root') as HTMLElement,
)
