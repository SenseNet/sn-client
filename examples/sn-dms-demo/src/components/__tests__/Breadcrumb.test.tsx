import { Repository } from '@sensenet/client-core'
import { Reducers, Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  MemoryRouter,
} from 'react-router-dom'
import { combineReducers } from 'redux'
import * as DMSReducers from '../../Reducers'
import BreadCrumb from '../BreadCrumb'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const sensenet = Reducers.sensenet
  const breadcrumb = DMSReducers.breadcrumb
  const myReducer = combineReducers({ sensenet, breadcrumb })

  const repository = new Repository({
    repositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
    requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId'] as any,
  })

  const options = {
    repository,
    rootReducer: myReducer,
    persistedState: {
      breadcrumb: [{
        id: 4465,
        name: 'Document library',
        path: '/Root/Profiles/Public/alba/Document_Library',
      }],
    },
  } as Store.CreateStoreOptions
  const store = Store.createSensenetStore(options)
  ReactDOM.render(
    <MemoryRouter>
      <BreadCrumb store={store} />
    </MemoryRouter>, div)
})
