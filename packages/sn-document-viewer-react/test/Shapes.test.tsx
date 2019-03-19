import { shallow } from 'enzyme'
import React from 'react'
import { ShapeAnnotation, ShapeHighlight, ShapeRedaction } from '../src/components/page-widgets/Shape'
import { ShapesComponent } from '../src/components/page-widgets/Shapes'
import { CommentMarker } from '../src/components/page-widgets/style'
import { exampleDocumentData, examplePreviewImageData } from './__Mocks__/viewercontext'

describe('Shapes component', () => {
  const defaultProps = {
    canEdit: true,
    canHideRedactions: true,
    highlights: exampleDocumentData.shapes.highlights,
    page: examplePreviewImageData,
    zoomRatio: 1,
    viewPort: { width: 1024, height: 768 },
    annotations: exampleDocumentData.shapes.annotations,
    redactions: exampleDocumentData.shapes.redactions,
    showRedactions: false,
    showShapes: false,
    updateShapeData: jest.fn(),
    commentMarkers: [{ x: 10, y: 10 }],
    showComments: false,
  }
  it('should render all the shapes', () => {
    const wrapper = shallow(<ShapesComponent {...defaultProps} showRedactions={true} showShapes={true} />)
    expect(wrapper.find(ShapeRedaction).exists()).toBeTruthy()
    expect(wrapper.find(ShapeAnnotation).exists()).toBeTruthy()
    expect(wrapper.find(ShapeHighlight).exists()).toBeTruthy()
  })

  it('should render just redactions', () => {
    const wrapper = shallow(<ShapesComponent {...defaultProps} showRedactions={true} showShapes={false} />)
    expect(wrapper.find(ShapeRedaction).exists()).toBeTruthy()
    expect(wrapper.find(ShapeAnnotation).exists()).toBeFalsy()
    expect(wrapper.find(ShapeHighlight).exists()).toBeFalsy()
  })

  it('should not render any shape or redactions', () => {
    const wrapper = shallow(<ShapesComponent {...defaultProps} />)
    expect(wrapper.find(ShapeRedaction).exists()).toBeFalsy()
    expect(wrapper.find(ShapeAnnotation).exists()).toBeFalsy()
    expect(wrapper.find(ShapeHighlight).exists()).toBeFalsy()
  })

  it('should render comment markers', () => {
    const wrapper = shallow(
      <ShapesComponent {...defaultProps} commentMarkers={[{ x: 10, y: 10 }, { x: 20, y: 20 }]} showComments={true} />,
    )
    expect(wrapper.find(CommentMarker).exists()).toBeTruthy()
    expect(wrapper.find(CommentMarker).length).toBe(2)
  })
})
