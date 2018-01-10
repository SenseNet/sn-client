import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  MemoryRouter
} from 'react-router-dom'
import { Store, Reducers } from 'sn-redux'
import { DMSReducers } from '../../Reducers'
import { Repository } from 'sn-client-js'
import { combineReducers } from 'redux'
import { Provider } from 'react-redux';
import 'rxjs'
import Registration from '../Registration';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const sensenet = Reducers.sensenet;
  const register = DMSReducers.register;
  const myReducer = combineReducers({ sensenet, register })

  const repository = new Repository.SnRepository({
    RepositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
    RequiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId']
  });

  repository.Config
  const store = Store.configureStore(myReducer, null, undefined, {
    sensenet: {
      session: {
        repository: {
          RepositoryUrl
          :
          'https://dmsservice.demo.sensenet.com'
        }
      }
    },
    register: {
      registrationError: 'error'
    }
  }, repository)
  ReactDOM.render(
    <MemoryRouter>
      <Provider store={store}>
        <Registration store={store} verify={() => { 
          // 
        }} />
      </Provider>
    </MemoryRouter>, div);
});