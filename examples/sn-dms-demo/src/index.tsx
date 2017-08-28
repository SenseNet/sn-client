import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  BrowserRouter as Router
} from 'react-router-dom'
import Sensenet from './Sensenet';
import { combineReducers } from 'redux'
import { Repository } from 'sn-client-js'
import { Store, Actions, Reducers } from 'sn-redux'
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';

import './index.css';
import 'rxjs'

const sensenet = Reducers.sensenet;
const myReducer = combineReducers({
  sensenet
});

const repository = new Repository.SnRepository({
  RepositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://sn-local'
});


const store = Store.configureStore(myReducer, null, undefined, {}, repository)
store.dispatch(Actions.InitSensenetStore('/Root/Sites/Default_Site', { select: 'all' }))


ReactDOM.render(

  <Provider store={store}>
    <Router>
    <Sensenet store={store} repository={repository} />
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
