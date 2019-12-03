import { shallow } from 'enzyme'
import React from 'react'
import { FullScreenDialog } from '../src/components/FullScreenDialog'

describe('FullScreenDialog', () => {
  const testprops = {
    isopen: true,
    openedImg: {
      imgIndex: 1,
      imgPath: 'Path',
      imgTitle: 'Title',
      imgDescription: 'Description',
      imgAuthor: 'Test Elek',
      imgAuthorAvatar: 'Avatar img Path',
      imgCreationDate: '2019.05.05',
      imgSize: '1024',
      imgDownloadUrl: 'Download Path',
    },
    closeFunction: jest.fn(),
    steppingFunction: jest.fn(),
    imgList: [],
  }
  it('Matches snapshot', () => {
    const wrapper = shallow(<FullScreenDialog {...testprops} />)
    expect(wrapper).toMatchSnapshot()
  })
})
