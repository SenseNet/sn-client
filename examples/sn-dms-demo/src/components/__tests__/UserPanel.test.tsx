// eslint-disable-next-line import/no-unresolved
import { CreateStoreOptions } from '@sensenet/redux/dist/types/Store'
import React from 'react'
import { render } from 'react-dom'
import { withStore } from '../../__tests__/TestHelper'
import { rootStateType } from '../../store/rootReducer'
import UserPanel from '../UserPanel'

it('renders without crashing', () => {
  const div = document.createElement('div')

  const options = {
    persistedState: {
      sensenet: {
        session: {
          repository: {
            repositoryUrl: 'https://dev.demo.sensenet.com',
          } as any,
          user: {
            fullName: 'Alba Monday',
            userAvatarPath: '/Root/Sites/Default_Site/demoavatars/alba.jpg',
            userLanguage: 'en-US',
            userName: 'alba',
          },
        },
      },
    },
  }

  render(withStore(<UserPanel />, options as CreateStoreOptions<rootStateType>), div)
})
