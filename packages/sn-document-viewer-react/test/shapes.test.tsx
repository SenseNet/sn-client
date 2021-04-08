import { mount, shallow } from 'enzyme'
import React from 'react'
import {
  CommentMarker,
  CommentStateContext,
  ShapeAnnotation,
  ShapeDraft,
  ShapeHighlight,
  ShapeRedaction,
  ShapeSkeleton,
  ShapesWidget,
  ShapesWidgetProps,
} from '../src'
import { CommentsContext } from '../src/context/comments'
import { DocumentDataContext } from '../src/context/document-data'
import { DocumentPermissionsContext } from '../src/context/document-permissions'
import { defaultViewerState, ViewerStateContext } from '../src/context/viewer-state'
import { exampleDocumentData, examplePreviewImageData } from './__Mocks__/viewercontext'

describe('Shapes component', () => {
  const defaultProps: ShapesWidgetProps = {
    imageRotation: 0,
    page: examplePreviewImageData,
    zoomRatioStanding: 1,
    zoomRatioLying: 1,
    visiblePagesIndex: 0,
  }

  it('should render all the shapes', () => {
    const wrapper = mount(
      <DocumentDataContext.Provider value={{ documentData: exampleDocumentData } as any}>
        <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideRedaction: true, canHideWatermark: true }}>
          <ViewerStateContext.Provider value={{ ...defaultViewerState, showRedaction: true, showShapes: true }}>
            <ShapesWidget {...defaultProps} />
          </ViewerStateContext.Provider>
        </DocumentPermissionsContext.Provider>
      </DocumentDataContext.Provider>,
    )
    expect(wrapper.find(ShapeRedaction).exists()).toBeTruthy()
    expect(wrapper.find(ShapeAnnotation).exists()).toBeTruthy()
    expect(wrapper.find(ShapeHighlight).exists()).toBeTruthy()
  })

  it('should render just redactions', () => {
    const wrapper = mount(
      <DocumentDataContext.Provider value={{ documentData: exampleDocumentData } as any}>
        <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideRedaction: true, canHideWatermark: true }}>
          <ViewerStateContext.Provider value={{ ...defaultViewerState, showRedaction: true, showShapes: false }}>
            <ShapesWidget {...defaultProps} />
          </ViewerStateContext.Provider>
        </DocumentPermissionsContext.Provider>
      </DocumentDataContext.Provider>,
    )
    expect(wrapper.find(ShapeRedaction).exists()).toBeTruthy()
    expect(wrapper.find(ShapeAnnotation).exists()).toBeFalsy()
    expect(wrapper.find(ShapeHighlight).exists()).toBeFalsy()
  })

  it('should not render any shape or redactions', () => {
    const wrapper = shallow(<ShapesWidget {...defaultProps} />)
    expect(wrapper.find(ShapeRedaction).exists()).toBeFalsy()
    expect(wrapper.find(ShapeAnnotation).exists()).toBeFalsy()
    expect(wrapper.find(ShapeHighlight).exists()).toBeFalsy()
  })

  it('should render comment markers', () => {
    const wrapper = mount(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, showComments: true }}>
        <CommentsContext.Provider
          value={{
            comments: [
              { x: '10', y: '10', id: 'a', page: 1, text: 'a', createdBy: {} as any },
              { x: '20', y: '20', id: 'b', page: 1, text: 'b', createdBy: {} as any },
            ],
            addPreviewComment: jest.fn(),
            deletePreviewComment: jest.fn(),
            getPreviewComments: jest.fn(),
          }}>
          <ShapesWidget {...defaultProps} />
        </CommentsContext.Provider>
      </ViewerStateContext.Provider>,
    )
    expect(wrapper.find(CommentMarker).exists()).toBeTruthy()
    expect(wrapper.find(CommentMarker).length).toBe(2)
  })

  it('should rotate comment marker on rotation degree(90)', () => {
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          rotation: [{ degree: 90, pageNum: 1 }],
          showComments: true,
        }}>
        <CommentsContext.Provider
          value={{
            comments: [{ x: '10', y: '30', id: 'a', page: 1, text: 'a', createdBy: {} as any }],
            addPreviewComment: jest.fn(),
            deletePreviewComment: jest.fn(),
            getPreviewComments: jest.fn(),
          }}>
          <ShapesWidget {...defaultProps} />
        </CommentsContext.Provider>
      </ViewerStateContext.Provider>,
    )

    const domNode = wrapper.find(CommentMarker).getDOMNode()
    const top = getComputedStyle(domNode).getPropertyValue('top')
    expect(top).toBe('10px')
    const right = getComputedStyle(domNode).getPropertyValue('right')
    expect(right).toBe('30px')
    const bottom = getComputedStyle(domNode).getPropertyValue('bottom')
    expect(bottom).toBe('')
    const left = getComputedStyle(domNode).getPropertyValue('left')
    expect(left).toBe('')
  })

  it('should rotate comment marker on rotation degree(180)', () => {
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          rotation: [{ degree: 180, pageNum: 1 }],
          showComments: true,
        }}>
        <CommentsContext.Provider
          value={{
            comments: [{ x: '10', y: '30', id: 'a', page: 1, text: 'a', createdBy: {} as any }],
            addPreviewComment: jest.fn(),
            deletePreviewComment: jest.fn(),
            getPreviewComments: jest.fn(),
          }}>
          <ShapesWidget {...defaultProps} />
        </CommentsContext.Provider>
      </ViewerStateContext.Provider>,
    )

    const domNode = wrapper.find(CommentMarker).getDOMNode()
    const top = getComputedStyle(domNode).getPropertyValue('top')
    expect(top).toBe('')
    const right = getComputedStyle(domNode).getPropertyValue('right')
    expect(right).toBe('10px')
    const bottom = getComputedStyle(domNode).getPropertyValue('bottom')
    expect(bottom).toBe('30px')
    const left = getComputedStyle(domNode).getPropertyValue('left')
    expect(left).toBe('')
  })

  it('should rotate comment marker on rotation degree(270)', () => {
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          rotation: [{ degree: 270, pageNum: 1 }],
          showComments: true,
        }}>
        <CommentsContext.Provider
          value={{
            comments: [{ x: '10', y: '30', id: 'a', page: 1, text: 'a', createdBy: {} as any }],
            addPreviewComment: jest.fn(),
            deletePreviewComment: jest.fn(),
            getPreviewComments: jest.fn(),
          }}>
          <ShapesWidget {...defaultProps} />
        </CommentsContext.Provider>
      </ViewerStateContext.Provider>,
    )

    const domNode = wrapper.find(CommentMarker).getDOMNode()
    const top = getComputedStyle(domNode).getPropertyValue('top')
    expect(top).toBe('')
    const right = getComputedStyle(domNode).getPropertyValue('right')
    expect(right).toBe('')
    const bottom = getComputedStyle(domNode).getPropertyValue('bottom')
    expect(bottom).toBe('10px')
    const left = getComputedStyle(domNode).getPropertyValue('left')
    expect(left).toBe('30px')
  })

  it('should set active comment click on marker', () => {
    const setActiveComment = jest.fn()
    const wrapper = mount(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, showComments: true }}>
        <CommentStateContext.Provider
          value={{ draft: undefined, setDraft: () => {}, activeCommentId: 'k', setActiveComment }}>
          <CommentsContext.Provider
            value={{
              comments: [
                { x: '10', y: '10', id: 'a', page: 1, text: 'a', createdBy: {} as any },
                { x: '20', y: '20', id: 'b', page: 1, text: 'b', createdBy: {} as any },
              ],
              addPreviewComment: jest.fn(),
              deletePreviewComment: jest.fn(),
              getPreviewComments: jest.fn(),
            }}>
            <ShapesWidget {...defaultProps} />
          </CommentsContext.Provider>
        </CommentStateContext.Provider>
      </ViewerStateContext.Provider>,
    )
    wrapper
      .find(CommentMarker)
      .first()
      .simulate('click', { nativeEvent: { stopImmediatePropagation: () => {} } })
    expect(setActiveComment).toBeCalledWith('a')
  })

  it('should handle keyup/mouseUp events', () => {
    const updateState = jest.fn()
    const updateDocumentData = jest.fn()

    const wrapper = mount(
      <DocumentDataContext.Provider
        value={{ documentData: exampleDocumentData, updateDocumentData, isInProgress: false, triggerReload: () => {} }}>
        <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideRedaction: true, canHideWatermark: true }}>
          <ViewerStateContext.Provider
            value={{ ...defaultViewerState, showRedaction: true, showShapes: true, updateState }}>
            <ShapesWidget {...defaultProps} />
          </ViewerStateContext.Provider>
        </DocumentPermissionsContext.Provider>
      </DocumentDataContext.Provider>,
    )
    wrapper.find(ShapeSkeleton).last().simulate('keyUp', { key: 'Delete' })
    expect(updateDocumentData).toBeCalled()
    expect(updateState).toBeCalledWith({ hasChanges: true })
  })

  it('should handle onBlur event', () => {
    const updateState = jest.fn()
    const updateDocumentData = jest.fn()

    const wrapper = mount(
      <DocumentDataContext.Provider
        value={{ documentData: exampleDocumentData, updateDocumentData, isInProgress: false, triggerReload: () => {} }}>
        <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideRedaction: true, canHideWatermark: true }}>
          <ViewerStateContext.Provider
            value={{ ...defaultViewerState, showRedaction: true, showShapes: true, updateState }}>
            <ShapesWidget {...defaultProps} />
          </ViewerStateContext.Provider>
        </DocumentPermissionsContext.Provider>
      </DocumentDataContext.Provider>,
    )

    wrapper.find('#annotation-input').simulate('focus')
    wrapper.find('#annotation-input').simulate('blur')
    expect(updateDocumentData).toBeCalled()
    expect(updateState).toBeCalledWith({ hasChanges: true })
  })

  it('should handle drag & drop event', () => {
    const updateState = jest.fn()
    const updateDocumentData = jest.fn()

    const wrapper = mount(
      <DocumentDataContext.Provider
        value={{ documentData: exampleDocumentData, updateDocumentData, isInProgress: false, triggerReload: () => {} }}>
        <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideRedaction: true, canHideWatermark: true }}>
          <ViewerStateContext.Provider
            value={{
              ...defaultViewerState,
              showRedaction: true,
              showShapes: true,
              updateState,
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
            <ShapesWidget {...defaultProps} />
          </ViewerStateContext.Provider>
        </DocumentPermissionsContext.Provider>
      </DocumentDataContext.Provider>,
    )

    window.HTMLElement.prototype.getClientRects = () => {
      return [
        {
          width: 700,
          height: 700,
          top: 100,
          left: 100,
          right: 800,
          bottom: 800,
          x: 100,
          y: 100,
        },
      ] as any
    }

    wrapper
      .find(ShapeSkeleton)
      .last()
      .simulate('drop', {
        dataTransfer: {
          getData: () => {
            return JSON.stringify({
              type: 'highlights',
              shape: {
                guid: '9a324f30-1423-11e9-bcb9-d719ddfb5f43',
                imageIndex: 1,
                h: 100,
                w: 100,
                x: 100,
                y: 100,
              },
              offset: {
                width: 10,
                height: 10,
              },
            })
          },
        },
        pageX: 600,
        pageY: 600,
      })

    expect(updateDocumentData).toBeCalled()
    expect(updateState).toBeCalledWith({ hasChanges: true })
  })

  it('should render ShapeDraft without crashing', () => {
    const wrapper = shallow(<ShapeDraft dimensions={{ top: 10, left: 20, height: 30, width: 40 }} />)
    expect(wrapper).toMatchSnapshot()
  })
})
