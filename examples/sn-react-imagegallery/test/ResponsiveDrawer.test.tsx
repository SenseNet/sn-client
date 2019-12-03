import { shallow } from 'enzyme'
import React from 'react'
import { ResponsiveDrawer } from '../src/components/ResponsiveDrawer'

describe('ResponsiveDrawer', () => {
  const testprops = {
    steppingFunction: jest.fn(),
    imageListLenght: 10,
    imageInfo: {
      imgIndex: 1,
      imgPath: 'Path',
      imgTitle: 'Title',
      imgDescription: 'Description',
      imgAuthor: 'Test Elek',
      imgAuthorAvatar: 'Avatar img Path',
      imgCreationDate: '2019.05.05',
      imgSize: '1024',
      imgDownloadUrl: 'Download Path',
      alt: 'Path',
    },
  }
  it('Matches snapshot', () => {
    const wrapper = shallow(<ResponsiveDrawer {...testprops} />)
    expect(wrapper).toMatchSnapshot()
  })
})
