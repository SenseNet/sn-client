import IconButton from '@material-ui/core/IconButton'
import { mount } from 'enzyme'
import React from 'react'
import { defaultViewerState, RotateActivePagesWidget, ROTATION_MODE, ViewerStateContext } from '../src'

describe('RotateActivePage component', () => {
  it('Should render without crashing', () => {
    const wrapper = mount(<RotateActivePagesWidget />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render without crashing with mode param', () => {
    const wrapper = mount(<RotateActivePagesWidget mode={ROTATION_MODE.clockwise} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render without crashing with mode param', () => {
    const wrapper = mount(<RotateActivePagesWidget mode={ROTATION_MODE.anticlockwise} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render without crashing with mode param', () => {
    const wrapper = mount(<RotateActivePagesWidget mode={ROTATION_MODE.all} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('RotateLeft should trigger a rotate to left', () => {
    const updateState = jest.fn()
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          updateState,
        }}>
        <RotateActivePagesWidget />
      </ViewerStateContext.Provider>,
    )

    wrapper.find(IconButton).first().simulate('click')
    expect(updateState).toBeCalledWith({ rotation: [{ degree: 270, pageNum: 1 }] })
  })

  it('RotateRight should trigger a rotate to right', () => {
    const updateState = jest.fn()
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          updateState,
        }}>
        <RotateActivePagesWidget />
      </ViewerStateContext.Provider>,
    )

    wrapper.find(IconButton).last().simulate('click')
    expect(updateState).toBeCalledWith({ rotation: [{ degree: 90, pageNum: 1 }] })
  })

  it('RotateRight should trigger a rotate to right even if viewerState has already rotation value', () => {
    const updateState = jest.fn()
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          rotation: [{ degree: 270, pageNum: 3 }],
          updateState,
        }}>
        <RotateActivePagesWidget />
      </ViewerStateContext.Provider>,
    )

    wrapper.find(IconButton).last().simulate('click')
    expect(updateState).toBeCalledWith({
      rotation: [
        { degree: 270, pageNum: 3 },
        { degree: 90, pageNum: 1 },
      ],
    })
  })

  it('RotateRight/RotateLeft should trigger a rotate to right/left even if viewerState has already rotation value on the same page', () => {
    const updateState = jest.fn()
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          rotation: [{ degree: 90, pageNum: 1 }],
          updateState,
        }}>
        <RotateActivePagesWidget />
      </ViewerStateContext.Provider>,
    )

    wrapper.find(IconButton).last().simulate('click')
    expect(updateState).toBeCalledWith({
      rotation: [{ degree: 180, pageNum: 1 }],
    })

    wrapper.find(IconButton).first().simulate('click')
    expect(updateState).toBeCalledWith({
      rotation: [{ degree: 90, pageNum: 1 }],
    })
  })
})
