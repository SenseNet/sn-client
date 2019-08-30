import React from 'react'
import { shallow } from 'enzyme'
import { CurrentAncestorsProvider } from '../src/context/current-ancestors'

describe('CurrentAncestors', () => {
  it('matches snapshot', () => {
    const p = shallow(<CurrentAncestorsProvider />)
    expect(p).toMatchSnapshot()
  })
})
