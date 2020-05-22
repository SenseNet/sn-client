import React from 'react'
import { shallow } from 'enzyme'
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
    it('should return 2 when the given number is divisible by three', () => {
      const value = pickTile(456)
      expect(value).toBe(2)
    })
  })
})
