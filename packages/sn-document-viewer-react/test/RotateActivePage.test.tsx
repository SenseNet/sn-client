import { shallow } from 'enzyme'
import React from 'react'
import { RotateActivePagesWidget } from '../src/components/document-widgets/RotateActivePages'
import { ROTATION_AMOUNT } from '../src/components/page-widgets/RotatePage'
import { examplePreviewImageData } from './__Mocks__/viewercontext'

describe('RotateActivePage component', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<RotateActivePagesWidget />)
    expect(wrapper).toMatchSnapshot()
  })

  it('RotateLeft should trigger a rotate to left', () => {
    const rotateImages = jest.fn()
    const wrapper = shallow(<RotateActivePagesWidget />)

    wrapper.find('#RotateActiveLeft').simulate('click')
    expect(rotateImages).toBeCalledWith([examplePreviewImageData.Index], -ROTATION_AMOUNT)
    expect(rotateImages).toBeCalled()
  })

  it('RotateRight should trigger a rotate to right', () => {
    const rotateImages = jest.fn()
    const wrapper = shallow(<RotateActivePagesWidget />)

    wrapper.find('#RotateActiveRight').simulate('click')
    expect(rotateImages).toBeCalledWith([examplePreviewImageData.Index], ROTATION_AMOUNT)
    expect(rotateImages).toBeCalled()
  })
})
