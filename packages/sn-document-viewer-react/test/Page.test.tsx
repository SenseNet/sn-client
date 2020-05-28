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
    const wrapper = mount(
      <PreviewImageDataContext.Provider
        value={{
          imageData: [{ ...examplePreviewImageData, PreviewImageUrl: undefined }],
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
      .simulate('click', { nativeEvent: { offsetX: 3, offsetY: 3 } })
    expect(setDraft).toBeCalledWith({ id: 'draft', x: '-6', y: '-6' })
  })
})
