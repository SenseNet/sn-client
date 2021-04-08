import React from 'react'
import { render } from 'react-dom'
import { FetchError } from '../FetchError'

it('renders without crashing', () => {
  const div = document.createElement('div')
  render(
    <FetchError
      message="error"
      onRetry={() => {
        //
      }}
    />,
    div,
  )
})
