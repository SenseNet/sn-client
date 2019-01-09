import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { WelcomeMessage } from '../WelcomeMessage'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<WelcomeMessage />, div)
})
