import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  HashRouter as Router
} from 'react-router-dom'
import Sensenet from './Sensenet';
import { combineReducers } from 'redux'
import { Repository } from 'sn-client-js'
import { Store, Actions, Reducers } from 'sn-redux'
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { DMSEpics } from './Epics'
import { DMSReducers } from './Reducers'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()
import './index.css';
import 'rxjs'

const sensenet = Reducers.sensenet;
const register = DMSReducers.register;
const myReducer = combineReducers({
  sensenet,
  register
});

const repository = new Repository.SnRepository({
  RepositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://sn-local'
});

repository.Config

const store = Store.configureStore(myReducer, DMSEpics.rootEpic, undefined, {}, repository)
store.dispatch(Actions.InitSensenetStore('/Root/Sites/Default_Site', { select: 'all' }))


ReactDOM.render(

  <Provider store={store}>
    <Router basename='/'>
    <Sensenet store={store} repository={repository} history={history} />
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
