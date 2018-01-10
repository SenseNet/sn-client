import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  MemoryRouter
} from 'react-router-dom'
import { Store, Reducers } from 'sn-redux'
import { DMSReducers } from '../../Reducers'
import { Repository } from 'sn-client-js'
import { combineReducers } from 'redux'
import 'rxjs'
import BreadCrumb from '../BreadCrumb';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const sensenet = Reducers.sensenet;
  const breadcrumb = DMSReducers.breadcrumb;
  const myReducer = combineReducers({ sensenet, breadcrumb })

  const repository = new Repository.SnRepository({
    RepositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
    RequiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId']
  });

  repository.Config
  const store = Store.configureStore(myReducer, null, undefined, {
    breadcrumb: [{
      id: 4465,
      name: 'Document library',
      path: '/Root/Profiles/Public/alba/Document_Library'
    }]
  }, repository)
  ReactDOM.render(
    <MemoryRouter>
      <BreadCrumb store={store} />
    </MemoryRouter>, div);
});