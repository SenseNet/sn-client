import { mount, shallow } from 'enzyme'
import React from 'react'
import { defaultViewerState, RotateDocumentWidget, ROTATION_MODE, ViewerStateContext } from '../src'
import { PreviewImageDataContext } from '../src/context/preview-image-data'
import { examplePreviewImageData } from './__Mocks__/viewercontext'

describe('RotateDocument component', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<RotateDocumentWidget />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render without crashing with mode param', () => {
    const wrapper = shallow(<RotateDocumentWidget mode={ROTATION_MODE.clockwise} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render without crashing with mode param', () => {
    const wrapper = shallow(<RotateDocumentWidget mode={ROTATION_MODE.anticlockwise} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render without crashing with mode param', () => {
    const wrapper = shallow(<RotateDocumentWidget mode={ROTATION_MODE.all} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('RotateLeft should trigger a rotate to left in all pages', () => {
    const updateState = jest.fn()
    const wrapper = mount(
      <PreviewImageDataContext.Provider
        value={{
          imageData: [{ ...examplePreviewImageData }, { ...examplePreviewImageData, Index: 2 }],
          setImageData: () => {},
        }}>
        <ViewerStateContext.Provider
          value={{
            ...defaultViewerState,
            updateState,
          }}>
          <RotateDocumentWidget />
        </ViewerStateContext.Provider>
      </PreviewImageDataContext.Provider>,
    )

    wrapper.find('#RotateLeft').first().simulate('click')
    expect(updateState).toBeCalledWith({
      rotation: [
        { degree: 270, pageNum: 1 },
        { degree: 270, pageNum: 2 },
      ],
    })
  })

  it('RotateRight should trigger a rotate to right in all pages', () => {
    const updateState = jest.fn()
    const wrapper = mount(
      <PreviewImageDataContext.Provider
        value={{
          imageData: [{ ...examplePreviewImageData }, { ...examplePreviewImageData, Index: 2 }],
          setImageData: () => {},
        }}>
        <ViewerStateContext.Provider
          value={{
            ...defaultViewerState,
            updateState,
          }}>
          <RotateDocumentWidget />
        </ViewerStateContext.Provider>
      </PreviewImageDataContext.Provider>,
    )

    wrapper.find('#RotateRight').first().simulate('click')
    expect(updateState).toBeCalledWith({
      rotation: [
        { degree: 90, pageNum: 1 },
        { degree: 90, pageNum: 2 },
      ],
    })
  })

  it('RotateRight/RotateLeft should trigger a rotate to right/left in all pages even if already have rotation', () => {
    const updateState = jest.fn()
    const wrapper = mount(
      <PreviewImageDataContext.Provider
        value={{
          imageData: [{ ...examplePreviewImageData }, { ...examplePreviewImageData, Index: 2 }],
          setImageData: () => {},
        }}>
        <ViewerStateContext.Provider
          value={{
            ...defaultViewerState,
            rotation: [{ pageNum: 1, degree: 90 }],
            updateState,
          }}>
          <RotateDocumentWidget />
        </ViewerStateContext.Provider>
      </PreviewImageDataContext.Provider>,
    )

    wrapper.find('#RotateRight').first().simulate('click')
    expect(updateState).toBeCalledWith({
      rotation: [
        { degree: 180, pageNum: 1 },
        { degree: 90, pageNum: 2 },
      ],
    })

    wrapper.find('#RotateLeft').first().simulate('click')
    expect(updateState).toBeCalledWith({
      rotation: [
        { degree: 90, pageNum: 1 },
        { degree: 0, pageNum: 2 },
      ],
    })
  })
})
