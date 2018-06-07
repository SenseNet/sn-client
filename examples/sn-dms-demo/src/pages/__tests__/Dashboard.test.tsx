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
import Dashboard from '../Dashboard'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const sensenet = Reducers.sensenet
  const breadcrumb = DMSReducers.breadcrumb
  const actionmenu = DMSReducers.actions
  const myReducer = combineReducers({ sensenet, breadcrumb, actionmenu })

  const repository = new Repository({
    repositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
    requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'Actions'] as any,
    defaultExpand: ['Actions'] as any,
  })

  const options = {
    repository,
    rootReducer: myReducer,
    persistedState: {
      sensenet: {
        session: {
          repository: {
            RepositoryUrl
              :
              'https://dmsservice.demo.sensenet.com',
          },
        },
      },
      breadcrumb: [{
        id: 4465,
        name: 'Document library',
        path: '/Root/Profiles/Public/alba/Document_Library',
      }],
      actionmenu: {
        actions: [],
      },
    },
  } as Store.CreateStoreOptions<any>

  const store = Store.createSensenetStore(options)
  ReactDOM.render(
    <MemoryRouter>
      <Provider store={store}>
        <Dashboard store={store} match={{ params: { id: 111 } }} />
      </Provider>
    </MemoryRouter>, div)
})
