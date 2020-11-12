import { mount, shallow } from 'enzyme'
import React from 'react'
import { defaultViewerState, Page, PreviewImageDataContext, ViewerStateContext } from '../src'
import { PageList } from '../src/components/PageList'
import { examplePreviewImageData } from './__Mocks__/viewercontext'

describe('PageList component', () => {
  it('should match snapshot with one page', () => {
    const wrapper = shallow(<PageList onPageClick={() => jest.fn} />)
    expect(wrapper).toMatchSnapshot()
  })
})
