import { shallow } from 'enzyme'
import React from 'react'
import { DesktopLayout } from '../src/components/Layout/DesktopLayout'

describe('Layout', () => {
  it('Matches snapshot', () => {
    const l = shallow(<DesktopLayout />)
    expect(l).toMatchSnapshot()
  })
})
