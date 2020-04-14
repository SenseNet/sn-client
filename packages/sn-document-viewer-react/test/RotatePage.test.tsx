import { mount, shallow } from 'enzyme'
import React from 'react'
import { IconButton } from '@material-ui/core'
import { RotatePageWidget, ROTATION_AMOUNT } from '../src/components/page-widgets/RotatePage'
import { PreviewImageDataContext } from '../src/context/preview-image-data'
import { examplePreviewImageData } from './__Mocks__/viewercontext'

describe('RotatePage component', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(
      <RotatePageWidget page={examplePreviewImageData} viewPort={{ height: 10, width: 10 }} zoomRatio={1} />,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('RotateLeft should trigger a rotate to left', () => {
    const rotateImages = jest.fn()

    const wrapper = mount(
      <PreviewImageDataContext.Provider
        value={{
          imageData: [examplePreviewImageData],
          rotateImages,
        }}>
        <RotatePageWidget page={examplePreviewImageData} viewPort={{ height: 10, width: 10 }} zoomRatio={1} />
      </PreviewImageDataContext.Provider>,
    )

    wrapper.find(IconButton).at(0).simulate('click')
    expect(rotateImages).toBeCalledWith([examplePreviewImageData.Index], -ROTATION_AMOUNT)
  })

  it('RotateRight should trigger a rotate to left', () => {
    const rotateImages = jest.fn()
    const wrapper = mount(
      <PreviewImageDataContext.Provider
        value={{
          imageData: [examplePreviewImageData],
          rotateImages,
        }}>
        <RotatePageWidget page={examplePreviewImageData} viewPort={{ height: 10, width: 10 }} zoomRatio={1} />
      </PreviewImageDataContext.Provider>,
    )

    wrapper.find(IconButton).at(1).simulate('click')
    expect(rotateImages).toBeCalledWith([examplePreviewImageData.Index], ROTATION_AMOUNT)
  })
})
