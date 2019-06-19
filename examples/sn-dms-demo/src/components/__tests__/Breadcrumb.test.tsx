import React from 'react'
import ReactDOM from 'react-dom'
import { MemoryRouter } from 'react-router-dom'
import { withStore } from '../../__tests__/TestHelper'
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
  ReactDOM.render(
    withStore(
      <MemoryRouter>
        <BreadCrumb
          ancestors={[]}
          currentContent={{ Id: 1, Name: 'aaa', Path: '/', Type: 'Folder' }}
          typeFilter={['DocumentLibrary', 'Folder']}
        />
      </MemoryRouter>,
      options,
    ),
    div,
  )
})
