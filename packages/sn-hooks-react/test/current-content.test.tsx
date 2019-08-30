import React from 'react'
import { shallow } from 'enzyme'
import { CurrentContentProvider } from '../src/context/current-content'

describe('CurrentContent', () => {
  it('matches snapshot', () => {
    const p = shallow(<CurrentContentProvider idOrPath={1} />)
    expect(p).toMatchSnapshot()
  })
})
