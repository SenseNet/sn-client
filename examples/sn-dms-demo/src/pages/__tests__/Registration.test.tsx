import { Repository } from '@sensenet/client-core'
import { Reducers, Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {
  MemoryRouter,
} from 'react-router-dom'
import { combineReducers } from 'redux'
import * as DMSReducers from '../../Reducers'
import Registration from '../Registration'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const sensenet = Reducers.sensenet
  const register = DMSReducers.register
  const myReducer = combineReducers({ sensenet, register })

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
      register: {
        registrationError: 'error',
      },
    },
  } as Store.CreateStoreOptions<any>

  const store = Store.createSensenetStore(options)
  ReactDOM.render(
    <MemoryRouter>
      <Provider store={store}>
        <Registration store={store} verify={() => {
          // dfgdfh
        }} />
      </Provider>
    </MemoryRouter>, div)
})
