import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  MemoryRouter
} from 'react-router-dom'
import { Provider } from 'react-redux';
import { Store, Reducers } from 'sn-redux'
import { DMSReducers } from '../../Reducers'
import { Repository } from 'sn-client-js'
import { combineReducers } from 'redux'
import 'rxjs'
import DocumentLibrary from '../DocumentLibrary';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const sensenet = Reducers.sensenet;
  const currentId = DMSReducers.currentId;
  const actionmenu = DMSReducers.actions;
  const myReducer = combineReducers({ sensenet, currentId, actionmenu })

  const repository = new Repository.SnRepository({
    RepositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
    RequiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId']
  });

  repository.Config
  const store = Store.configureStore(myReducer, null, undefined, {
    currentId: 1,
    actionmenu: {
      actions: []
    }
  }, repository)
  ReactDOM.render(
    <Provider store={store}>
      <MemoryRouter>
        <DocumentLibrary store={store} />
      </MemoryRouter>
    </Provider>, div);
});