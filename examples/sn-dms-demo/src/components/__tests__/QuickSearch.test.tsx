import React from 'react'
import { render } from 'react-dom'
import { MemoryRouter } from 'react-router'
import { withStore } from '../../__tests__/TestHelper'
import { Search } from '../Search/Search'

it('renders without crashing', () => {
  const div = document.createElement('div')
  render(
    withStore(
      <MemoryRouter>
        <Search />
      </MemoryRouter>,
    ),
    div,
  )
})
