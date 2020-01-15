import { LoginState } from '@sensenet/client-core'
import { Store } from '@sensenet/redux'
import React from 'react'
import ReactDOM from 'react-dom'
import { MemoryRouter } from 'react-router-dom'
import { withStore } from '../../__tests__/TestHelper'
import { rootStateType } from '../../store/rootReducer'
import Registration from '../Registration'

it('renders without crashing', () => {
  const div = document.createElement('div')

  const options: Partial<Store.CreateStoreOptions<rootStateType>> = {
    persistedState: {
      sensenet: {
        currentcontent: {
          contentState: {
            isSaved: false,
          },
        },
        batchResponses: {
          response: null,
        },
        session: {
          country: '',
          language: '',
          loginState: LoginState.Pending,
          user: {
            userName: 'aaa',
          },
          error: null,
          repository: null,
        },
        selected: {
          ids: [123],
        },
        currentitems: {
          ids: [123],
          entities: [{ Id: 123 }],
        } as any,
      },
      dms: {
        register: {
          registrationError: 'error',
        },
      },
    },
  }

  ReactDOM.render(
    withStore(
      <MemoryRouter>
        <Registration verify={null} oAuthProvider={null as any} />
      </MemoryRouter>,
      options,
    ),
    div,
  )
})
