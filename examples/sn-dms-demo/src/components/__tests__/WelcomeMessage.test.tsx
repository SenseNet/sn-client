import React from 'react'
import { render } from 'react-dom'
import { WelcomeMessage } from '../WelcomeMessage'

it('renders without crashing', () => {
  const div = document.createElement('div')
  render(<WelcomeMessage />, div)
})
