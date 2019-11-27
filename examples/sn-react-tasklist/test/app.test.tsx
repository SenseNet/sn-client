import { shallow } from 'enzyme'
import React from 'react'
import { App } from '../src/app'

describe('The app layout instance', () => {
  it('should renders correctly', () => {
    expect(shallow(<App />)).toMatchSnapshot()
  })
})
