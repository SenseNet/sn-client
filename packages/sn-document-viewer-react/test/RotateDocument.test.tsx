import { mount, shallow } from 'enzyme'
import React from 'react'
import { RotateDocumentWidget } from '../src/components/document-widgets/RotateDocument'
import { PreviewImageDataContext } from '../src/context/preview-image-data'
import { examplePreviewImageData } from './__Mocks__/viewercontext'

describe('RotateDocument component', () => {
  it('Should render without crashing', () => {
    const rotateImages = jest.fn()
    const wrapper = shallow(
      <PreviewImageDataContext.Provider value={{ imageData: [examplePreviewImageData], rotateImages }}>
        <RotateDocumentWidget />
      </PreviewImageDataContext.Provider>,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('RotateLeft should trigger a rotate to left', () => {
    const rotateImages = jest.fn()
    const wrapper = mount(
      <PreviewImageDataContext.Provider value={{ imageData: [examplePreviewImageData], rotateImages }}>
        <RotateDocumentWidget />
      </PreviewImageDataContext.Provider>,
    )
    wrapper.find('#RotateLeft').first().simulate('click')
    expect(rotateImages).toBeCalledWith([1], -90)
  })

  it('RotateRight should trigger a rotate to right', () => {
    const rotateImages = jest.fn()
    const wrapper = mount(
      <PreviewImageDataContext.Provider value={{ imageData: [examplePreviewImageData], rotateImages }}>
        <RotateDocumentWidget />
      </PreviewImageDataContext.Provider>,
    )
    wrapper.find('#RotateRight').first().simulate('click')
    expect(rotateImages).toBeCalledWith([1], 90)
  })
})
