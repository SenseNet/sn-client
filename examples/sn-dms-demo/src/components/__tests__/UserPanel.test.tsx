import { Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { rootStateType } from '../..'
import { withStore } from '../../__tests__/TestHelper'
import UserPanel from '../UserPanel'

it('renders without crashing', () => {
  const div = document.createElement('div')

  const options = {
    persistedState: {
      sensenet: {
        session: {
          repository: {
            RepositoryUrl: 'https://dmsservice.demo.sensenet.com',
          },
          user: {
            fullName: 'Alba Monday',
            userAvatarPath: '/Root/Sites/Default_Site/demoavatars/alba.jpg',
            userLanguage: 'en-US',
            userName: 'alba',
          },
        },
      },
    },
  } as Partial<Store.CreateStoreOptions<rootStateType>>

  ReactDOM.render(withStore(
    <UserPanel />, options), div)
})
