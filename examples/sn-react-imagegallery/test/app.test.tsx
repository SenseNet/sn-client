import { shallow } from 'enzyme'
import React from 'react'
import { App, Transition } from '../src/app'

describe('App Layout', () => {
  it('Matches snapshot', () => {
    const l = shallow(<App />)
    expect(l).toMatchSnapshot()
  })
  it('matches Transition snapshot', () => {
    const l = shallow(<Transition />)
    expect(l).toMatchSnapshot()
  })
})
