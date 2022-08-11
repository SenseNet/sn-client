/* eslint-disable import/no-unresolved */
import { Repository } from '@sensenet/client-core'
import { Reducers, Store } from '@sensenet/redux'
import { CreateStoreOptions } from '@sensenet/redux/dist/types/Store'
import React from 'react'
import { Provider } from 'react-redux'
import { combineReducers } from 'redux'
import { dms } from '../Reducers'
import { rootStateType } from '../store/rootReducer'

it('Should help tests', () => {
  /** */
})

export const withStore = (component: JSX.Element, options?: Partial<CreateStoreOptions<rootStateType>>) => {
  const myReducer = combineReducers({
    sensenet: Reducers.sensenet,
    dms,
  })
  const repository = new Repository({
    repositoryUrl: process.env.REACT_APP_SERVICE_URL,
    requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId'] as any,
  })
  const defaultOptions = {
    repository,
    rootReducer: myReducer,
    persistedState: {
      sensenet: {
        session: {
          repository: {
            RepositoryUrl: 'https://dev.demo.sensenet.com',
          },
        },
      },
    },
  }
  const store = Store.createSensenetStore({ ...defaultOptions, ...options } as CreateStoreOptions<rootStateType>)

  return <Provider store={store}>{component}</Provider>
}
