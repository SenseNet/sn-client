// eslint-disable-next-line import/no-unresolved
import { CreateStoreOptions } from '@sensenet/redux/dist/types/Store'
import React from 'react'
import { render } from 'react-dom'
import { MemoryRouter } from 'react-router-dom'
import { withStore } from '../../__tests__/TestHelper'
import { rootStateType } from '../../store/rootReducer'
import BreadCrumb from '../BreadCrumb'

it('renders without crashing', () => {
  const div = document.createElement('div')

  const options = {
    persistedState: {
      dms: {
        breadcrumb: [
          {
            id: 4465,
            name: 'Document library',
            path: '/Root/Profiles/Public/alba/Document_Library',
          },
        ],
      },
    },
  }
  render(
    withStore(
      <MemoryRouter>
        <BreadCrumb
          ancestors={[]}
          currentContent={{ Id: 1, Name: 'aaa', Path: '/', Type: 'Folder' }}
          typeFilter={['DocumentLibrary', 'Folder']}
        />
      </MemoryRouter>,
      options as CreateStoreOptions<rootStateType>,
    ),
    div,
  )
})
