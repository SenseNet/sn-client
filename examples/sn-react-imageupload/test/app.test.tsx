import { shallow } from 'enzyme'
import React from 'react'
import { App } from '../src/app'

describe('Layout', () => {
  it('Matches snapshot', () => {
    const l = shallow(<App />)
    expect(l).toMatchSnapshot()
  })
})
