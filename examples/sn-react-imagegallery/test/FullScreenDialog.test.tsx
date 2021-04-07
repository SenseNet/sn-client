import { shallow } from 'enzyme'
import React from 'react'
import { FullScreenDialog } from '../src/components/full-screen-dialog'

describe('FullScreenDialog', () => {
  const testprops = {
    open: true,
    openedImage: {
      Id: 1,
      Name: 'Image',
      Type: 'Image',
      Path: 'Path',
      Index: 1,
      imgTitle: 'Title',
      Description: 'Description',
      CreationDate: '2019.05.05',
    },
    handleDelete: jest.fn(),
    closeFunction: jest.fn(),
    steppingFunction: jest.fn(),
    imgList: [],
  }
  it('Matches snapshot', () => {
    const wrapper = shallow(<FullScreenDialog {...testprops} />)
    expect(wrapper).toMatchSnapshot()
  })
})
