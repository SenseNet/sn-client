import React from 'react'
import { render } from 'react-dom'
import { withStore } from '../../__tests__/TestHelper'
import UserActionMenu from '../UserActionMenu'

it('renders without crashing', () => {
  const div = document.createElement('div')
  render(withStore(<UserActionMenu />), div)
})
