import { shallow } from 'enzyme'
import React from 'react'
import { ShapeAnnotation, ShapeHighlight, ShapeRedaction } from '../src/components/page-widgets/Shape'
import { ShapesComponent } from '../src/components/page-widgets/Shapes'
import { exampleDocumentData, examplePreviewImageData } from './__Mocks__/viewercontext'

describe('Shapes component', () => {
  it('should render all the shapes', () => {
    const wrapper = shallow(
      <ShapesComponent
        canEdit={true}
        canHideRedactions={true}
        highlights={exampleDocumentData.shapes.highlights}
        page={examplePreviewImageData}
        zoomRatio={1}
        viewPort={{ width: 1024, height: 768 }}
        annotations={exampleDocumentData.shapes.annotations}
        redactions={exampleDocumentData.shapes.redactions}
        showRedactions={true}
        showShapes={true}
        updateShapeData={jest.fn()}
      />,
    )
    expect(wrapper.find(ShapeRedaction).exists()).toBeTruthy()
    expect(wrapper.find(ShapeAnnotation).exists()).toBeTruthy()
    expect(wrapper.find(ShapeHighlight).exists()).toBeTruthy()
  })

  it('should render just redactions', () => {
    const wrapper = shallow(
      <ShapesComponent
        canEdit={true}
        canHideRedactions={true}
        highlights={exampleDocumentData.shapes.highlights}
        page={examplePreviewImageData}
        zoomRatio={1}
        viewPort={{ width: 1024, height: 768 }}
        annotations={exampleDocumentData.shapes.annotations}
        redactions={exampleDocumentData.shapes.redactions}
        showRedactions={true}
        showShapes={false}
        updateShapeData={jest.fn()}
      />,
    )
    expect(wrapper.find(ShapeRedaction).exists()).toBeTruthy()
    expect(wrapper.find(ShapeAnnotation).exists()).toBeFalsy()
    expect(wrapper.find(ShapeHighlight).exists()).toBeFalsy()
  })

  it('should not render any shape or redactions', () => {
    const wrapper = shallow(
      <ShapesComponent
        canEdit={true}
        canHideRedactions={true}
        highlights={exampleDocumentData.shapes.highlights}
        page={examplePreviewImageData}
        zoomRatio={1}
        viewPort={{ width: 1024, height: 768 }}
        annotations={exampleDocumentData.shapes.annotations}
        redactions={exampleDocumentData.shapes.redactions}
        showRedactions={false}
        showShapes={false}
        updateShapeData={jest.fn()}
      />,
    )
    expect(wrapper.find(ShapeRedaction).exists()).toBeFalsy()
    expect(wrapper.find(ShapeAnnotation).exists()).toBeFalsy()
    expect(wrapper.find(ShapeHighlight).exists()).toBeFalsy()
  })
})
