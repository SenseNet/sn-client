import { addGoogleAuth } from '@sensenet/authentication-google'
import { Repository } from '@sensenet/client-core'
import { Reducers, Store } from '@sensenet/redux'
import createHistory from 'history/createBrowserHistory'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {
  HashRouter as Router,
} from 'react-router-dom'
import { combineReducers } from 'redux'
import * as DMSReducers from './Reducers'
import registerServiceWorker from './registerServiceWorker'
import Sensenet from './Sensenet'
const history = createHistory()
import { JwtService } from '@sensenet/authentication-jwt'
import './index.css'
import { MessageBoxHandler } from './utils/MessageBoxHandler'

const sensenet = Reducers.sensenet
const dms = DMSReducers.dms
const myReducer = combineReducers({
  sensenet,
  dms,
})

const repository = new Repository({
  repositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
  requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'Actions', 'Avatar'] as any,
  defaultExpand: ['Actions'] as any,
})
const jwt = new JwtService(repository)
addGoogleAuth (jwt, {
  clientId: '188576321252-ok4dg714hibsrjpt6luaee0u1jc56r7l.apps.googleusercontent.com',
})

const options = {
  repository,
  rootReducer: myReducer,
} as Store.CreateStoreOptions
const store = Store.createSensenetStore(options)

const handler = new MessageBoxHandler(repository, store)

ReactDOM.render(
  <Provider store={store}>
    <Router basename="/">
      <Sensenet repository={repository} history={history} />
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement,
)
registerServiceWorker()
