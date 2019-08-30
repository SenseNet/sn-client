import React from 'react'
import { shallow } from 'enzyme'
import { SessionContextProvider } from '../src/context/session'

describe('Session', () => {
  it('matches snapshot', () => {
    const p = shallow(<SessionContextProvider />)
    expect(p).toMatchSnapshot()
  })
})
