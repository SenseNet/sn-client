import React from 'react'
import { shallow } from 'enzyme'
import { CurrentChildrenProvider } from '../src/context/current-children'

describe('CurrentChildren', () => {
  it('matches snapshot', () => {
    const p = shallow(<CurrentChildrenProvider />)
    expect(p).toMatchSnapshot()
  })
})
