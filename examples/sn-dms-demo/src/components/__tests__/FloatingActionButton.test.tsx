import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { MemoryRouter } from 'react-router-dom'
import { withStore } from '../../__tests__/TestHelper'
import FloatingActionButton from '../FloatingActionButton'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(withStore(<MemoryRouter>
    <FloatingActionButton />
  </MemoryRouter>)
    , div)
})
