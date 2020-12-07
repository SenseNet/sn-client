import { shallow } from 'enzyme'
import React from 'react'
import { LayoutAppBar } from '../src/components/layout-app-bar'

describe('Layout AppBar component', () => {
  it('should match snapshot with children', () => {
    const wrapper = shallow(
      <LayoutAppBar>
        <span>test</span>
      </LayoutAppBar>,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
