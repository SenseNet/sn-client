import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  MemoryRouter
} from 'react-router-dom'
import { Provider } from 'react-redux';
import Sensenet from '../Sensenet';
import { Repository, Content, ContentTypes } from 'sn-client-js'
import { combineReducers } from 'redux'
import { Store, Actions, Reducers } from 'sn-redux'
import 'rxjs'

const div = document.createElement('div');

  const sensenet = Reducers.sensenet;
  const myReducer = combineReducers({
    sensenet
  });

  const repository = new Repository.SnRepository({
    RepositoryUrl: 'https://sn-services/'
  });


it('renders without crashing', () => {
  
  const store = Store.configureStore(myReducer, null, undefined, {}, repository)

  ReactDOM.render(
    <Provider store={store}>
      <MemoryRouter>
        <Sensenet store={store} repository={repository} />
      </MemoryRouter>
    </Provider>, div);
});

it('renders without crashing', () => {
  
  const store = Store.configureStore(myReducer, null, undefined, {}, repository)

  ReactDOM.render(
    <Provider store={store}>
      <MemoryRouter>
        <Sensenet store={store} repository={repository} />
      </MemoryRouter>
    </Provider>, div);
});