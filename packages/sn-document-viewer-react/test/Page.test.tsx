import CircularProgress from '@material-ui/core/CircularProgress'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { Page, PageProps } from '../src/components/Page'
import { defaultViewerState, ViewerStateContext } from '../src/context/viewer-state'
import { PreviewImageDataContext } from '../src/context/preview-image-data'
import { examplePreviewImageData } from './__Mocks__/viewercontext'

describe('Page component', () => {
  const defaultProps: PageProps = {
    onClick: jest.fn(),
    imageIndex: 1,
    image: 'preview',
    elementName: 'EL',
    zoomMode: 'fit',
    zoomLevel: 0,
    viewportWidth: 1024,
    viewportHeight: 768,
    showWidgets: true,
    margin: 8,
    fitRelativeZoomLevel: 0,
  }

  it('Should render without crashing', () => {
    const wrapper = shallow(<Page {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render thumbnails without crashing', () => {
    const wrapper = shallow(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, showWatermark: false }}>
        <Page {...defaultProps} image="thumbnail" showWidgets={false} />
      </ViewerStateContext.Provider>,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render a loader when polling', () => {
    const wrapper = shallow(
      <PreviewImageDataContext.Provider
        value={{
          imageData: [examplePreviewImageData],
          rotateImages: () => undefined,
        }}>
        <Page {...defaultProps} />,
      </PreviewImageDataContext.Provider>,
    )
    expect(wrapper.find(CircularProgress).exists()).toBeTruthy()
  })

  it('Should handle onClick event', () => {
    const onClick = jest.fn()
    const wrapper = shallow(<Page {...defaultProps} onClick={onClick} />)
    wrapper
      .find('div')
      .first()
      .simulate('click')
    expect(onClick).toBeCalled()
  })

  it('should handle marker placement', () => {
    const updateState = jest.fn()
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          updateState,
          isPlacingCommentMarker: true,
        }}>
        <Page {...defaultProps} />
      </ViewerStateContext.Provider>,
    )
    wrapper
      .find('div')
      .first()
      .simulate('click', { nativeEvent: { offsetX: 10, offsetY: 10 } })
    expect(updateState).toBeCalledWith({ isPlacingCommentMarker: false })
  })
})
