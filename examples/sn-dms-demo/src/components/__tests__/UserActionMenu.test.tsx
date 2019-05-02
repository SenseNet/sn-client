import React from 'react'
import ReactDOM from 'react-dom'
import { withStore } from '../../__tests__/TestHelper'
import UserActionMenu from '../UserActionMenu'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(withStore(<UserActionMenu />), div)
})
