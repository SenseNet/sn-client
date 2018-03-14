import { Repository } from '@sensenet/client-core'
import { Reducers, Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { combineReducers } from 'redux'
import * as DMSReducers from '../../../Reducers'
import ActionMenu from '../ActionMenu'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const sensenet = Reducers.sensenet
  const actionmenu = DMSReducers.actions
  const myReducer = combineReducers({ sensenet, actionmenu })

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
  } as Store.CreateStoreOptions
  const store = Store.createSensenetStore(options)
  ReactDOM.render(
    <ActionMenu store={store} />, div)
})
