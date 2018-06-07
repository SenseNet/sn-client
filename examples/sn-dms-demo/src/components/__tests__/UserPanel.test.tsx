import { Repository } from '@sensenet/client-core'
import { Reducers, Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { combineReducers } from 'redux'
import UserPanel from '../UserPanel'

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
      },
    },
  } as Store.CreateStoreOptions<any>
  const store = Store.createSensenetStore(options)
  ReactDOM.render(
    <UserPanel user={{
      fullName: 'Alba Monday',
      userAvatarPath: '/Root/Sites/Default_Site/demoavatars/alba.jpg',
      userLanguage: 'en-US',
      userName: 'alba',
    }} store={store} />, div)
})
