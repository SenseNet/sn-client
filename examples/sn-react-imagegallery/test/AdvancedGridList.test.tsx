import { shallow } from 'enzyme'
import React from 'react'
import { AdvancedGridList } from '../src/components/advanced-grid-list'
import { images } from './mocks/images'

describe('AdvancedGridList', () => {
  const testprops = {
    requestReload: jest.fn(),
    openFunction: jest.fn(),
    imgList: images as any[],
  }
  it('Matches snapshot', () => {
    const wrapper = shallow(<AdvancedGridList {...testprops} />)
    expect(wrapper).toMatchSnapshot()
  })
})
