import { shallow } from 'enzyme'
import React from 'react'
import { PageListComponent } from '../src/components/PageList'

describe('PageList component', () => {
  it('should match snapshot with one page', () => {
    const wrapper = shallow(
      <PageListComponent
        pages={[{ Height: 100, Width: 50, Index: 1 }]}
        showWidgets={true}
        id="sn-document-viewer-pages"
        zoomMode="originalSize"
        zoomLevel={1}
        fitRelativeZoomLevel={1}
        onPageClick={() => jest.fn}
        elementNamePrefix="Page-"
        images="preview"
        tolerance={0}
        padding={8}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
