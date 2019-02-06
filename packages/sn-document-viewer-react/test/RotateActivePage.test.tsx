import { shallow } from 'enzyme'
import React from 'react'
import { RotateActivePagesComponent } from '../src/components/document-widgets/RotateActivePages'
import { ROTATION_AMOUNT } from '../src/components/page-widgets/RotatePage'
import { examplePreviewImageData } from './__Mocks__/viewercontext'

describe('RotateActivePage component', () => {
  const locals = {
    rotateDocumentLeft: 'rotateDocumentLeft',
    rotateDocumentRight: 'rotateDocumentRight',
    pages: [],
    activePages: [1],
  }
  it('Should render without crashing', () => {
    const wrapper = shallow(<RotateActivePagesComponent {...locals} rotateImages={jest.fn()} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('RotateLeft should trigger a rotate to left', () => {
    const rotateImages = jest.fn()
    const wrapper = shallow(<RotateActivePagesComponent {...locals} rotateImages={rotateImages} />)

    wrapper.find('#RotateActiveLeft').simulate('click')
    expect(rotateImages).toBeCalledWith([examplePreviewImageData.Index], -ROTATION_AMOUNT)
    expect(rotateImages).toBeCalled()
  })

  it('RotateRight should trigger a rotate to right', () => {
    const rotateImages = jest.fn()
    const wrapper = shallow(<RotateActivePagesComponent {...locals} rotateImages={rotateImages} />)

    wrapper.find('#RotateActiveRight').simulate('click')
    expect(rotateImages).toBeCalledWith([examplePreviewImageData.Index], ROTATION_AMOUNT)
    expect(rotateImages).toBeCalled()
  })
})
