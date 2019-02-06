import RotateLeft from '@material-ui/icons/RotateLeft'
import RotateRight from '@material-ui/icons/RotateRight'
import { shallow } from 'enzyme'
import React from 'react'
import { RotatePageComponent, ROTATION_AMOUNT } from '../src/components/page-widgets/RotatePage'
import { examplePreviewImageData } from './__Mocks__/viewercontext'

describe('RotatePage component', () => {
  const locals = {
    rotateLeft: 'rotatePageLeft',
    rotateRight: 'rotatePageRight',
  }
  it('Should render without crashing', () => {
    const wrapper = shallow(
      <RotatePageComponent
        {...locals}
        page={examplePreviewImageData}
        viewPort={{ width: 1024, height: 768 }}
        zoomRatio={1}
        rotateImages={jest.fn()}
        rotateShapesForPages={jest.fn()}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('RotateLeft should trigger a rotate to left', () => {
    const rotateImages = jest.fn()
    const rotateShapesForPages = jest.fn()
    const wrapper = shallow(
      <RotatePageComponent
        {...locals}
        page={examplePreviewImageData}
        viewPort={{ width: 1024, height: 768 }}
        zoomRatio={1}
        rotateImages={rotateImages}
        rotateShapesForPages={rotateShapesForPages}
      />,
    )

    wrapper.find(RotateLeft).simulate('click')
    expect(rotateImages).toBeCalledWith([examplePreviewImageData.Index], -ROTATION_AMOUNT)
    expect(rotateShapesForPages).toBeCalledWith(
      [
        {
          index: examplePreviewImageData.Index,
          size: { width: examplePreviewImageData.Width, height: examplePreviewImageData.Height },
        },
      ],
      -ROTATION_AMOUNT,
    )
  })

  it('RotateRight should trigger a rotate to left', () => {
    const rotateImages = jest.fn()
    const rotateShapesForPages = jest.fn()
    const wrapper = shallow(
      <RotatePageComponent
        {...locals}
        page={examplePreviewImageData}
        viewPort={{ width: 1024, height: 768 }}
        zoomRatio={1}
        rotateImages={rotateImages}
        rotateShapesForPages={rotateShapesForPages}
      />,
    )

    wrapper.find(RotateRight).simulate('click')
    expect(rotateImages).toBeCalledWith([examplePreviewImageData.Index], ROTATION_AMOUNT)
    expect(rotateShapesForPages).toBeCalledWith(
      [
        {
          index: examplePreviewImageData.Index,
          size: { width: examplePreviewImageData.Width, height: examplePreviewImageData.Height },
        },
      ],
      ROTATION_AMOUNT,
    )
  })
})
