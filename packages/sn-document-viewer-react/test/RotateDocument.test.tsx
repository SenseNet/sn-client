import RotateLeft from '@material-ui/icons/RotateLeft'
import RotateRight from '@material-ui/icons/RotateRight'
import { shallow } from 'enzyme'
import React from 'react'
import { RotateDocumentComponent } from '../src/components/document-widgets/RotateDocument'
import { examplePreviewImageData } from './__Mocks__/viewercontext'

describe('RotateDocument component', () => {
  const locals = {
    rotateDocumentLeft: 'rotateDocumentLeft',
    rotateDocumentRight: 'rotateDocumentRight',
  }
  it('Should render without crashing', () => {
    const wrapper = shallow(
      <RotateDocumentComponent
        rotateImages={jest.fn()}
        pages={[examplePreviewImageData]}
        activePages={[1]}
        {...locals}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('RotateLeft should trigger a rotate to left', () => {
    const rotateImages = jest.fn()
    const wrapper = shallow(
      <RotateDocumentComponent
        rotateImages={rotateImages}
        pages={[examplePreviewImageData]}
        activePages={[1]}
        {...locals}
      />,
    )
    wrapper.find('#RotateLeft').simulate('click')
    expect(rotateImages).toBeCalledWith([1], -90)
  })

  it('RotateRight should trigger a rotate to right', () => {
    const rotateImages = jest.fn()
    const wrapper = shallow(
      <RotateDocumentComponent
        rotateImages={rotateImages}
        pages={[examplePreviewImageData]}
        activePages={[1]}
        {...locals}
      />,
    )
    wrapper.find('#RotateRight').simulate('click')
    expect(rotateImages).toBeCalledWith([1], 90)
  })
})
