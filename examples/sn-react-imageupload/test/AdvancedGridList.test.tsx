import { shallow } from 'enzyme'
import React from 'react'
import { AdvancedGridList, pickTile } from '../src/components/AdvancedGridList'
import { DropFileArea } from '../src/components/DropFileArea'
import { images } from './mocks/images'

describe('AdvancedGridList', () => {
  const testprops = {
    imgList: images as any[],
    uploadsetdata: jest.fn(),
    notificationControll: jest.fn(),
  }
  it('should set isDragover to be true', () => {
    const wrapper = shallow(<AdvancedGridList {...testprops} />)
    wrapper.find(DropFileArea).prop('setDragOver')(true)

    expect(wrapper.update().find(DropFileArea).prop('isDragOver')).toBe(true)
  })
})
describe('pickTile function', () => {
  it('should return 2', () => {
    const value = pickTile(456)
    expect(value).toBe(2)
  })
})
