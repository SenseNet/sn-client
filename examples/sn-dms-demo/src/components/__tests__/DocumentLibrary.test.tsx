import { Repository } from '@sensenet/client-core'
import { Reducers, Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {
  MemoryRouter,
} from 'react-router-dom'
import { combineReducers } from 'redux'
import 'rxjs'
import * as DMSReducers from '../../Reducers'
import DocumentLibrary from '../DocumentLibrary'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const sensenet = Reducers.sensenet
  const currentId = DMSReducers.currentId
  const actionmenu = DMSReducers.actions
  const myReducer = combineReducers({ sensenet, currentId, actionmenu })

  const repository = new Repository({
    repositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
    requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId'] as any,
  })

  const options = {
    repository,
    rootReducer: myReducer,
    persistedState: {
      actionmenu: {
        actions: [],
      },
    },
  } as Store.CreateStoreOptions<any>
  const store = Store.createSensenetStore(options)
  ReactDOM.render(
    <Provider store={store}>
      <MemoryRouter>
        <DocumentLibrary store={store} />
      </MemoryRouter>
    </Provider>, div)
})
