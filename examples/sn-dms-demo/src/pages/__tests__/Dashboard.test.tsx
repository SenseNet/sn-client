import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  MemoryRouter
} from 'react-router-dom'
import { Store, Actions, Reducers } from 'sn-redux'
import { DMSReducers } from '../../Reducers'
import { Repository } from 'sn-client-js'
import { combineReducers } from 'redux'
import { Provider } from 'react-redux';
import 'rxjs'
import Dashboard from '../Dashboard';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const sensenet = Reducers.sensenet;
  const breadcrumb = DMSReducers.breadcrumb;
  const actionmenu = DMSReducers.actions;
  const myReducer = combineReducers({ sensenet, breadcrumb, actionmenu })

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
    breadcrumb: [{
      id: 4465,
      name: 'Document library',
      path: '/Root/Profiles/Public/alba/Document_Library'
    }],
    actionmenu: {
      actions: []
    }
  }, repository)
  ReactDOM.render(
    <MemoryRouter>
      <Provider store={store}>
        <Dashboard store={store} match={{ params: { id: 111 } }} />
      </Provider>
    </MemoryRouter>, div);
});