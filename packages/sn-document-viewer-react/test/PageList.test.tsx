import React from 'react'
import { shallow } from 'enzyme'
import { PageList } from '../src/components/PageList'

describe('PageList component', () => {
  it('should match snapshot with one page', () => {
    const wrapper = shallow(
      <PageList
        showWidgets={true}
        id="sn-document-viewer-pages"
        zoomMode="originalSize"
        zoomLevel={1}
        fitRelativeZoomLevel={1}
        onPageClick={() => jest.fn}
        elementName="Page"
        images="preview"
        tolerance={0}
        padding={8}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
