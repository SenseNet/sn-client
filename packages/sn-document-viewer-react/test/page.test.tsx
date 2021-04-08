import CircularProgress from '@material-ui/core/CircularProgress'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { DocumentDataContext } from '../src'
import { Page, PageProps } from '../src/components/page'
import { CommentStateContext } from '../src/context/comment-states'
import { PreviewImageDataContext } from '../src/context/preview-image-data'
import { defaultViewerState, ViewerStateContext } from '../src/context/viewer-state'
import { mouseMove, mouseUp } from './__Mocks__/global-functions'
import { exampleDocumentData, examplePreviewImageData } from './__Mocks__/viewercontext'

describe('Page component', () => {
  const defaultProps: PageProps = {
    onClick: jest.fn(),
    page: {
      Index: 1,
      Width: 768,
      Height: 1024,
    },
    viewportWidth: 768,
    viewportHeight: 1024,
    visiblePagesIndex: 0,
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

  it('should handle drawing a highlight', () => {
    const updateDocumentData = jest.fn()
    const wrapper = mount(
      <DocumentDataContext.Provider
        value={{
          documentData: {
            ...exampleDocumentData,
            pageCount: 6,
          },
          updateDocumentData,
          isInProgress: false,
          triggerReload: () => {},
        }}>
        <ViewerStateContext.Provider
          value={{
            ...defaultViewerState,
            activeShapePlacing: 'highlight',
            zoomLevel: 0,
            pagesRects: [
              {
                visiblePage: 0,
                pageRect: {
                  top: 100,
                  bottom: 800,
                  right: 800,
                  left: 100,
                  toJSON: () => {},
                  x: 100,
                  y: 100,
                  height: 700,
                  width: 700,
                },
              },
            ],
            boxBottom: 800,
            boxTop: 100,
            boxRight: 800,
            boxLeft: 100,
          }}>
          <PreviewImageDataContext.Provider value={{ imageData: [examplePreviewImageData] } as any}>
            <Page {...defaultProps} />
          </PreviewImageDataContext.Provider>
        </ViewerStateContext.Provider>
      </DocumentDataContext.Provider>,
    )

    wrapper
      .find('div')
      .at(1)
      .simulate('mouseDown', { nativeEvent: { offsetX: 1, offsetY: 1, pageX: 600, pageY: 600 } })

    act(() => {
      mouseMove(605, 605)
      mouseUp(605, 605)
    })

    expect(updateDocumentData).toBeCalled()
  })

  it('should handle drawing a redaction', () => {
    const updateDocumentData = jest.fn()
    const wrapper = mount(
      <DocumentDataContext.Provider
        value={{
          documentData: {
            ...exampleDocumentData,
            pageCount: 6,
          },
          updateDocumentData,
          isInProgress: false,
          triggerReload: () => {},
        }}>
        <ViewerStateContext.Provider
          value={{
            ...defaultViewerState,
            activeShapePlacing: 'redaction',
            zoomLevel: 0,
            pagesRects: [
              {
                visiblePage: 0,
                pageRect: {
                  top: 100,
                  bottom: 800,
                  right: 800,
                  left: 100,
                  toJSON: () => {},
                  x: 100,
                  y: 100,
                  height: 700,
                  width: 700,
                },
              },
            ],
            boxBottom: 800,
            boxTop: 100,
            boxRight: 800,
            boxLeft: 100,
          }}>
          <PreviewImageDataContext.Provider value={{ imageData: [examplePreviewImageData] } as any}>
            <Page {...defaultProps} />
          </PreviewImageDataContext.Provider>
        </ViewerStateContext.Provider>
      </DocumentDataContext.Provider>,
    )

    wrapper
      .find('div')
      .at(1)
      .simulate('mouseDown', { nativeEvent: { offsetX: 1, offsetY: 1, pageX: 600, pageY: 600 } })
    act(() => {
      mouseMove(605, 605)
      mouseUp(605, 605)
    })

    expect(updateDocumentData).toBeCalled()
  })

  it('should handle drawing a annotation', () => {
    const updateDocumentData = jest.fn()
    const wrapper = mount(
      <DocumentDataContext.Provider
        value={{
          documentData: {
            ...exampleDocumentData,
            pageCount: 6,
          },
          updateDocumentData,
          isInProgress: false,
          triggerReload: () => {},
        }}>
        <ViewerStateContext.Provider
          value={{
            ...defaultViewerState,
            activeShapePlacing: 'annotation',
            zoomLevel: 0,
            pagesRects: [
              {
                visiblePage: 0,
                pageRect: {
                  top: 100,
                  bottom: 800,
                  right: 800,
                  left: 100,
                  toJSON: () => {},
                  x: 100,
                  y: 100,
                  height: 700,
                  width: 700,
                },
              },
            ],
            boxBottom: 800,
            boxTop: 100,
            boxRight: 800,
            boxLeft: 100,
          }}>
          <PreviewImageDataContext.Provider value={{ imageData: [examplePreviewImageData] } as any}>
            <Page {...defaultProps} />
          </PreviewImageDataContext.Provider>
        </ViewerStateContext.Provider>
      </DocumentDataContext.Provider>,
    )

    wrapper
      .find('div')
      .at(1)
      .simulate('mouseDown', { nativeEvent: { offsetX: 1, offsetY: 1, pageX: 600, pageY: 600 } })
    act(() => {
      mouseMove(605, 605)
      mouseUp(605, 605)
    })

    expect(updateDocumentData).toBeCalled()
  })
})
