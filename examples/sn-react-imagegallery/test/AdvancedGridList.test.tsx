import { shallow } from 'enzyme'
import React from 'react'
import { AdvancedGridList, pickTile } from '../src/components/AdvancedGridList'
import { images } from './mocks/images'

describe('AdvancedGridList', () => {
  const testprops = {
    openFunction: jest.fn(),
    imgList: images as any[],
  }
  it('Matches snapshot', () => {
    const wrapper = shallow(<AdvancedGridList {...testprops} />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('pickTile', () => {
    it('should return 2', () => {
      const value = pickTile(456)
      expect(value).toBe(2)
    })
  })
})
