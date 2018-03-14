import { Repository } from '@sensenet/client-core'
import { Task } from '@sensenet/default-content-types'
import { Reducers, Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {
  MemoryRouter,
} from 'react-router-dom'
import { combineReducers } from 'redux'
import SimpleTableRow from '../SimpleTableRow'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const sensenet = Reducers.sensenet
  const myReducer = combineReducers({ sensenet })

  const repository = new Repository({
    repositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
    requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId'] as any,
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
        children: {
          entities: {
            123: {
              Id: 123,
            },
          },
        },
      },
    },
  } as Store.CreateStoreOptions
  const store = Store.createSensenetStore(options)

  const content = { DisplayName: 'My content', Id: 123, Path: '/workspaces' } as Task
  ReactDOM.render(
    <MemoryRouter>
      <Provider store={store}>
        <SimpleTableRow
          store={store}
          content={content} />
      </Provider>
    </MemoryRouter>, div)
})
