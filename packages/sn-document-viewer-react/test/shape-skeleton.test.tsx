import { Delete } from '@material-ui/icons'
import { mount } from 'enzyme'
import React from 'react'
import { DocumentPermissionsContext, ShapeSkeleton } from '../src'
describe('ShapesSkeleton component', () => {
  it('should render without crashing', () => {
    const wrapper = mount(
      <ShapeSkeleton
        rotationDegree={0}
        shapeType="redactions"
        zoomRatio={1}
        shape={{
          guid: 'testRedaction',
          imageIndex: 1,
          h: 1,
          w: 1,
          x: 10,
          y: 10,
        }}
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
          shape={{
            h: 100,
            w: 100,
            x: 10,
            y: 10,
            imageIndex: 1,
            guid: '9a324f30-1423-11e9-bcb9-d719ddfb5f43',
          }}
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
          shape={{
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
          }}
          removeShape={removeShape}
          updateShapeData={updateShapeData}
        />
      </DocumentPermissionsContext.Provider>,
    )
    wrapper.find('#annotation-input').simulate('focus')
    wrapper.find('#annotation-input').simulate('blur')
    expect(updateShapeData).toBeCalled()
  })
})
