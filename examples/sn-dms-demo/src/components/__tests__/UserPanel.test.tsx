import React from 'react'
import ReactDOM from 'react-dom'
import { withStore } from '../../__tests__/TestHelper'
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

  ReactDOM.render(withStore(<UserPanel />, options), div)
})
