import { shallow } from 'enzyme'
import React from 'react'
import { FullScreenLoader } from '../src/components/full-screen-loader'

describe('FullScreenLoader', () => {
  it('Matches snapshot', () => {
    const l = shallow(<FullScreenLoader />)
    expect(l).toMatchSnapshot()
  })
})
