import { shallow } from 'enzyme'
import React from 'react'
import { ShapeAnnotation, ShapeHighlight, ShapeRedaction } from '../src/components/page-widgets/Shape'
import { ShapesWidget, ShapesWidgetProps } from '../src/components/page-widgets/Shapes'
import { CommentMarker } from '../src/components/page-widgets/style'
import { defaultViewerState, ViewerStateContext } from '../src/context/viewer-state'
import { CommentsContext } from '../src/context/comments'
import { examplePreviewImageData } from './__Mocks__/viewercontext'

describe('Shapes component', () => {
  const defaultProps: ShapesWidgetProps = {
    page: examplePreviewImageData,
    zoomRatio: 1,
    viewPort: { width: 1024, height: 768 },
  }

  it('should render all the shapes', () => {
    const wrapper = shallow(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, showRedaction: true, showShapes: true }}>
        <ShapesWidget {...defaultProps} />
      </ViewerStateContext.Provider>,
    )
    expect(wrapper.find(ShapeRedaction).exists()).toBeTruthy()
    expect(wrapper.find(ShapeAnnotation).exists()).toBeTruthy()
    expect(wrapper.find(ShapeHighlight).exists()).toBeTruthy()
  })

  it('should render just redactions', () => {
    const wrapper = shallow(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, showRedaction: true, showShapes: false }}>
        <ShapesWidget {...defaultProps} />
      </ViewerStateContext.Provider>,
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
    const wrapper = shallow(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, showComments: true }}>
        <CommentsContext.Provider
          value={{
            comments: [
              { x: 10, y: 10, id: 'a', page: 1, text: 'a', createdBy: {} as any },
              { x: 20, y: 20, id: 'b', page: 1, text: 'b', createdBy: {} as any },
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
})
