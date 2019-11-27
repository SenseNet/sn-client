import { shallow } from 'enzyme'
import React from 'react'
import { App } from '../src/app'

describe('App', () => {
  it('App snapshot', () => {
    const l = shallow(<App />)
    expect(l).toMatchSnapshot()
  })
})
