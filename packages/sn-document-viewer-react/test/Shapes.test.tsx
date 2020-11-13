import { mount, shallow } from 'enzyme'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import {
  CommentMarker,
  ShapeAnnotation,
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
import { defaultTheme } from '../src/models'
import { exampleDocumentData, examplePreviewImageData } from './__Mocks__/viewercontext'

describe('Shapes component', () => {
  const defaultProps: ShapesWidgetProps = {
    page: examplePreviewImageData,
    zoomRatio: 1,
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
      <ThemeProvider theme={defaultTheme}>
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
        </ViewerStateContext.Provider>
      </ThemeProvider>,
    )
    expect(wrapper.find(CommentMarker).exists()).toBeTruthy()
    expect(wrapper.find(CommentMarker).length).toBe(2)
  })

  it('should handle keyup/mouseUp events', () => {
    const updateState = jest.fn()
    const updateDocumentData = jest.fn()

    const wrapper = mount(
      <DocumentDataContext.Provider
        value={{ documentData: exampleDocumentData, updateDocumentData, isInProgress: false }}>
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
        value={{ documentData: exampleDocumentData, updateDocumentData, isInProgress: false }}>
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
        value={{ documentData: exampleDocumentData, updateDocumentData, isInProgress: false }}>
        <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideRedaction: true, canHideWatermark: true }}>
          <ViewerStateContext.Provider
            value={{ ...defaultViewerState, showRedaction: true, showShapes: true, updateState }}>
            <ShapesWidget {...defaultProps} />
          </ViewerStateContext.Provider>
        </DocumentPermissionsContext.Provider>
      </DocumentDataContext.Provider>,
    )

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
      })

    expect(updateDocumentData).toBeCalled()
    expect(updateState).toBeCalledWith({ hasChanges: true })
  })
})
