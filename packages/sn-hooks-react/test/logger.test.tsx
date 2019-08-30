import React from 'react'
import { shallow } from 'enzyme'
import { LoggerContextProvider } from '../src/context/logger'

describe('Logger', () => {
  it('matches snapshot', () => {
    const p = shallow(<LoggerContextProvider />)
    expect(p).toMatchSnapshot()
  })
})
