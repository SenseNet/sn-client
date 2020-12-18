import { mount } from 'enzyme'
import React from 'react'
import { DocumentPermissionsContext, ShapeHighlight, ShapeRedaction, ShapeSkeleton } from '../src'

const exampleShape = {
  h: 100,
  w: 200,
  x: 10,
  y: 10,
  imageIndex: 1,
  guid: '9a324f30-1423-11e9-bcb9-d719ddfb5f43',
}

const exampleAnnotation = {
  h: 100,
  w: 100,
  x: 10,
  y: 10,
  text: 'Example Text',
  guid: '9a324f30-1423-11e9-bcb9-d719ddfb5f43',
  lineHeight: 15,
  fontBold: 34,
  imageIndex: 1,
  fontColor: 'red',
  fontFamily: 'arial',
  fontItalic: false,
  fontSize: 12,
}

describe('ShapesSkeleton component', () => {
  it('should render without crashing', () => {
    const wrapper = mount(
      <ShapeSkeleton
        rotationDegree={0}
        shapeType="redactions"
        zoomRatio={1}
        shape={exampleShape}
        removeShape={() => {}}
        updateShapeData={() => {}}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should handle keyup/mouseUp events', () => {
    const removeShape = jest.fn()
    const updateShapeData = jest.fn()

    const wrapper = mount(
      <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideRedaction: true, canHideWatermark: true }}>
        <ShapeSkeleton
          rotationDegree={0}
          shapeType="highlights"
          zoomRatio={1}
          shape={exampleShape}
          removeShape={removeShape}
          updateShapeData={updateShapeData}
        />
      </DocumentPermissionsContext.Provider>,
    )

    wrapper.simulate('keyUp', { key: 'Delete' })
    expect(removeShape).toBeCalled()

    wrapper.simulate('keyUp', { key: 'Backspace' })
    expect(removeShape).toBeCalled()
  })

  it('should handle onBlur event', () => {
    const removeShape = jest.fn()
    const updateShapeData = jest.fn()

    const wrapper = mount(
      <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideRedaction: true, canHideWatermark: true }}>
        <ShapeSkeleton
          rotationDegree={0}
          shapeType="annotations"
          zoomRatio={1}
          shape={exampleAnnotation}
          removeShape={removeShape}
          updateShapeData={updateShapeData}
        />
      </DocumentPermissionsContext.Provider>,
    )
    wrapper.find('#annotation-input').simulate('focus')
    wrapper.find('#annotation-input').simulate('blur')
    expect(updateShapeData).toBeCalled()
  })

  it('should handle resize annotation', () => {
    const updateShapeData = jest.fn()

    const wrapper = mount(
      <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideRedaction: true, canHideWatermark: true }}>
        <ShapeSkeleton
          rotationDegree={0}
          shapeType="annotations"
          zoomRatio={1}
          shape={exampleAnnotation}
          removeShape={() => {}}
          updateShapeData={updateShapeData}
        />
      </DocumentPermissionsContext.Provider>,
    )

    wrapper.find('#annotation-wrapper').simulate('mouseUp')
    expect(updateShapeData).toBeCalled()
  })

  it('should handle resize highlight', () => {
    const updateShapeData = jest.fn()

    const wrapper = mount(
      <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideRedaction: true, canHideWatermark: true }}>
        <ShapeSkeleton
          rotationDegree={0}
          shapeType="highlights"
          zoomRatio={1}
          shape={exampleShape}
          removeShape={() => {}}
          updateShapeData={updateShapeData}
        />
      </DocumentPermissionsContext.Provider>,
    )

    wrapper.find(ShapeHighlight).simulate('mouseUp')
    expect(updateShapeData).toBeCalled()
  })

  it('should handle resize redaction', () => {
    const updateShapeData = jest.fn()

    const wrapper = mount(
      <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideRedaction: true, canHideWatermark: true }}>
        <ShapeSkeleton
          rotationDegree={0}
          shapeType="redactions"
          zoomRatio={1}
          shape={exampleShape}
          removeShape={() => {}}
          updateShapeData={updateShapeData}
        />
      </DocumentPermissionsContext.Provider>,
    )

    wrapper.find(ShapeRedaction).simulate('mouseUp')
    expect(updateShapeData).toBeCalled()
  })

  it('should handle to drag redaction', () => {
    const setData = jest.fn()

    const wrapper = mount(
      <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideRedaction: true, canHideWatermark: true }}>
        <ShapeSkeleton
          rotationDegree={0}
          shapeType="redactions"
          zoomRatio={1}
          shape={exampleShape}
          removeShape={() => {}}
          updateShapeData={() => {}}
        />
      </DocumentPermissionsContext.Provider>,
    )

    const dataTransferValue = JSON.stringify({
      type: 'redactions',
      shape: exampleShape,
      offset: {
        width: null,
        height: null,
      },
    })

    const event = { dataTransfer: { setData } }
    wrapper.find(ShapeRedaction).simulate('dragStart', event)
    expect(setData).toBeCalledWith('shape', dataTransferValue)
  })

  it('should handle to drag highlight', () => {
    const setData = jest.fn()

    const wrapper = mount(
      <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideRedaction: true, canHideWatermark: true }}>
        <ShapeSkeleton
          rotationDegree={0}
          shapeType="highlights"
          zoomRatio={1}
          shape={exampleShape}
          removeShape={() => {}}
          updateShapeData={() => {}}
        />
      </DocumentPermissionsContext.Provider>,
    )

    const dataTransferValue = JSON.stringify({
      type: 'highlights',
      shape: exampleShape,
      offset: {
        width: null,
        height: null,
      },
    })

    const event = { dataTransfer: { setData } }
    wrapper.find(ShapeHighlight).simulate('dragStart', event)
    expect(setData).toBeCalledWith('shape', dataTransferValue)
  })

  it('should handle to drag annotation', () => {
    const setData = jest.fn()

    const wrapper = mount(
      <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideRedaction: true, canHideWatermark: true }}>
        <ShapeSkeleton
          rotationDegree={0}
          shapeType="annotations"
          zoomRatio={1}
          shape={exampleAnnotation}
          removeShape={() => {}}
          updateShapeData={() => {}}
        />
      </DocumentPermissionsContext.Provider>,
    )

    const dataTransferValue = JSON.stringify({
      type: 'annotations',
      shape: exampleAnnotation,
      offset: {
        width: null,
        height: null,
      },
    })

    const event = { dataTransfer: { setData } }
    wrapper.find('#annotation-input').simulate('dragStart', event)
    expect(setData).toBeCalledWith('shape', dataTransferValue)
  })
})
