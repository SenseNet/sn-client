import { shallow } from 'enzyme'
import React from 'react'
import { FullScreenLoader } from '../src/components/full-screen-loader'

describe('The full screen loader instance', () => {
  it('should renders correctly', () => {
    expect(shallow(<FullScreenLoader />)).toMatchSnapshot()
  })
})
