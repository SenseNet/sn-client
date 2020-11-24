import CircularProgress from '@material-ui/core/CircularProgress'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { Page, PageProps } from '../src/components/Page'
import { CommentStateContext } from '../src/context/comment-states'
import { PreviewImageDataContext } from '../src/context/preview-image-data'
import { defaultViewerState, ViewerStateContext } from '../src/context/viewer-state'
import { examplePreviewImageData } from './__Mocks__/viewercontext'

describe('Page component', () => {
  const defaultProps: PageProps = {
    onClick: jest.fn(),
    imageIndex: 1,
    viewportWidth: 768,
    viewportHeight: 1024,
    relativeWidth: 768,
    relativeHeight: 1024,
  }

  it('Should render without crashing', () => {
    const wrapper = shallow(<Page {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render page without crashing', () => {
    const wrapper = shallow(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, showWatermark: false }}>
        <Page {...defaultProps} />
      </ViewerStateContext.Provider>,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render a loader when polling', () => {
    const wrapper = mount(
      <PreviewImageDataContext.Provider
        value={{
          imageData: [{ ...examplePreviewImageData, PreviewImageUrl: undefined }],
          setImageData: () => {},
        }}>
        <Page {...defaultProps} />,
      </PreviewImageDataContext.Provider>,
    )
    expect(wrapper.find(CircularProgress).exists()).toBeTruthy()
  })

  it('Should handle onClick event', () => {
    const onClick = jest.fn()
    const wrapper = shallow(<Page {...defaultProps} onClick={onClick} />)
    wrapper.find('div').first().simulate('click')
    expect(onClick).toBeCalled()
  })

  it('should handle marker placement', () => {
    const setDraft = jest.fn()
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          isPlacingCommentMarker: true,
          zoomLevel: 0,
        }}>
        <CommentStateContext.Provider value={{ setDraft } as any}>
          <PreviewImageDataContext.Provider value={{ imageData: [examplePreviewImageData] } as any}>
            <Page {...defaultProps} />
          </PreviewImageDataContext.Provider>
        </CommentStateContext.Provider>
      </ViewerStateContext.Provider>,
    )

    wrapper
      .find('div')
      .at(1)
      .simulate('click', { nativeEvent: { offsetX: 20, offsetY: 20 } })
    expect(setDraft).toBeCalledWith({ id: 'draft', page: 1, x: '10', y: '10' })
  })

  it('should handle marker placement with rotation', () => {
    const setDraft = jest.fn()
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          isPlacingCommentMarker: true,
          zoomLevel: 0,
          rotation: [{ pageNum: 1, degree: 90 }],
        }}>
        <CommentStateContext.Provider value={{ setDraft } as any}>
          <PreviewImageDataContext.Provider value={{ imageData: [examplePreviewImageData] } as any}>
            <Page {...defaultProps} />
          </PreviewImageDataContext.Provider>
        </CommentStateContext.Provider>
      </ViewerStateContext.Provider>,
    )

    wrapper
      .find('div')
      .at(1)
      .simulate('click', { nativeEvent: { offsetX: 11, offsetY: 11 } })
    expect(setDraft).toBeCalledWith({ id: 'draft', page: 1, x: '1', y: '1' })
  })
})
