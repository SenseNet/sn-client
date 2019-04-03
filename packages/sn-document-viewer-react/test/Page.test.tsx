import { shallow } from 'enzyme'
import React from 'react'
import { PageComponent } from '../src/components/Page'
import { exampleDocumentData, examplePreviewImageData } from './__Mocks__/viewercontext'

describe('Page component', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(
      <PageComponent
        onClick={() => undefined}
        imageIndex={1}
        image={{} as any}
        elementNamePrefix={'EL'}
        zoomMode={'fit'}
        zoomLevel={0}
        viewportWidth={1024}
        viewportHeight={768}
        showWidgets={true}
        margin={8}
        fitRelativeZoomLevel={0}
        version="1A"
        showWatermark={true}
        activePages={[1]}
        documentData={exampleDocumentData}
        page={examplePreviewImageData}
        pollInterval={0}
        previewAvailable={jest.fn()}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('Should handle onClick event', () => {
    const onClick = jest.fn()
    const wrapper = shallow(
      <PageComponent
        onClick={onClick}
        imageIndex={1}
        image={{} as any}
        elementNamePrefix={'EL'}
        zoomMode={'fit'}
        zoomLevel={0}
        viewportWidth={1024}
        viewportHeight={768}
        showWidgets={true}
        margin={8}
        fitRelativeZoomLevel={0}
        version="1A"
        showWatermark={true}
        activePages={[1]}
        documentData={exampleDocumentData}
        page={examplePreviewImageData}
        pollInterval={0}
        previewAvailable={jest.fn()}
      />,
    )
    wrapper
      .find('div')
      .first()
      .simulate('click')
    expect(onClick).toBeCalled()
  })
})
