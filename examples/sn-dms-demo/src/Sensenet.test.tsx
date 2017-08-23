import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Sensenet from './Sensenet';
import { Repository } from 'sn-client-js'
import { combineReducers } from 'redux'
import { Store, Actions, Reducers } from 'sn-redux'
import 'rxjs'

it('renders without crashing', () => {
  const div = document.createElement('div');

  const sensenet = Reducers.sensenet;
  const myReducer = combineReducers({
    sensenet
  });

  const repository = new Repository.SnRepository({
    RepositoryUrl: 'https://sn-services/'
  });
  
  const store = Store.configureStore(myReducer, null, undefined, {}, repository)
  store.dispatch(Actions.InitSensenetStore('/Root/Sites/Default_Site/tasks', { select: 'all', filter: "isof('Task')" }))

  ReactDOM.render(<Sensenet store={store} repository={repository} />, div);
});
