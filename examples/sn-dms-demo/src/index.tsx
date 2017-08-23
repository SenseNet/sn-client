import * as React from 'react';
import * as ReactDOM from 'react-dom';
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
  RepositoryUrl: 'https://sn-services/'
});


const store = Store.configureStore(myReducer, null, undefined, {}, repository)
store.dispatch(Actions.InitSensenetStore('/Root/Sites/Default_Site/tasks', { select: 'all', filter: "isof('Task')" }))


ReactDOM.render(

  <Provider store={store}>
    <Sensenet store={store} repository={repository} />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
