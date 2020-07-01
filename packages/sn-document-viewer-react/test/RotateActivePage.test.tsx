import IconButton from '@material-ui/core/IconButton'
import { mount } from 'enzyme'
import React from 'react'
import { RotateActivePagesWidget } from '../src/components/document-widgets/RotateActivePages'
import { ROTATION_AMOUNT, ROTATION_MODE } from '../src/components/page-widgets/RotatePage'
import { PreviewImageDataContext } from '../src/context/preview-image-data'
import { examplePreviewImageData } from './__Mocks__/viewercontext'

describe('RotateActivePage component', () => {
  it('Should render without crashing', () => {
    const wrapper = mount(<RotateActivePagesWidget />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render without crashing with mode param', () => {
    const wrapper = mount(<RotateActivePagesWidget mode={ROTATION_MODE.clockwise} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render without crashing with mode param', () => {
    const wrapper = mount(<RotateActivePagesWidget mode={ROTATION_MODE.anticlockwise} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render without crashing with mode param', () => {
    const wrapper = mount(<RotateActivePagesWidget mode={ROTATION_MODE.all} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('RotateLeft should trigger a rotate to left', () => {
    const rotateImages = jest.fn()
    const wrapper = mount(
      <PreviewImageDataContext.Provider value={{ rotateImages } as any}>
        <RotateActivePagesWidget />
      </PreviewImageDataContext.Provider>,
    )

    wrapper.find(IconButton).first().simulate('click')
    expect(rotateImages).toBeCalledWith([examplePreviewImageData.Index], -ROTATION_AMOUNT)
    expect(rotateImages).toBeCalled()
  })

  it('RotateRight should trigger a rotate to right', () => {
    const rotateImages = jest.fn()
    const wrapper = mount(
      <PreviewImageDataContext.Provider value={{ rotateImages } as any}>
        <RotateActivePagesWidget />
      </PreviewImageDataContext.Provider>,
    )

    wrapper.find(IconButton).last().simulate('click')
    expect(rotateImages).toBeCalledWith([examplePreviewImageData.Index], ROTATION_AMOUNT)
    expect(rotateImages).toBeCalled()
  })

  it('RotateLeft should trigger a rotate to left', () => {
    const rotateImages = jest.fn()
    const wrapper = mount(
      <PreviewImageDataContext.Provider value={{ rotateImages } as any}>
        <RotateActivePagesWidget mode={ROTATION_MODE.anticlockwise} />
      </PreviewImageDataContext.Provider>,
    )

    wrapper.find(IconButton).first().simulate('click')
    expect(rotateImages).toBeCalledWith([examplePreviewImageData.Index], -ROTATION_AMOUNT)
    expect(rotateImages).toBeCalled()
  })

  it('RotateRight should trigger a rotate to right', () => {
    const rotateImages = jest.fn()
    const wrapper = mount(
      <PreviewImageDataContext.Provider value={{ rotateImages } as any}>
        <RotateActivePagesWidget mode={ROTATION_MODE.clockwise} />
      </PreviewImageDataContext.Provider>,
    )

    wrapper.find(IconButton).last().simulate('click')
    expect(rotateImages).toBeCalledWith([examplePreviewImageData.Index], ROTATION_AMOUNT)
    expect(rotateImages).toBeCalled()
  })
})
