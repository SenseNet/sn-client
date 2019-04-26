import React from 'react'
import ReactDOM from 'react-dom'
import { MemoryRouter } from 'react-router'
import QuickSearchInput from '../Search/SearchInput'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <MemoryRouter>
      <div>
        <QuickSearchInput
          isLoading={false}
          isOpen={false}
          onClick={() => {
            /** */
          }}
        />
      </div>
    </MemoryRouter>,
    div,
  )
})
