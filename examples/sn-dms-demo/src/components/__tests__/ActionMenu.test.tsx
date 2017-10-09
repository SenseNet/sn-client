import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Store, Actions, Reducers } from 'sn-redux'
import { DMSReducers } from '../../Reducers'
import { Repository } from 'sn-client-js'
import { combineReducers } from 'redux'
import 'rxjs'
import ActionMenu from '../ActionMenu';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const sensenet = Reducers.sensenet;
  const actionmenu = DMSReducers.actions;
  const myReducer = combineReducers({ sensenet, actionmenu })

  const repository = new Repository.SnRepository({
    RepositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
    RequiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId']
  });

  repository.Config
  const store = Store.configureStore(myReducer, null, undefined, {
    actionmenu: {
      actions: []
    }
  }, repository)
  ReactDOM.render(
    <ActionMenu store={store} />, div);
});