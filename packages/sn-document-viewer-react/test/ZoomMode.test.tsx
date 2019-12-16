import { MenuItem } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import SvgIcon from '@material-ui/core/SvgIcon'
import { mount } from 'enzyme'
import React from 'react'
import { ZoomModeWidget } from '../src/components/document-widgets/ZoomMode'
import { defaultViewerState, ViewerStateContext } from '../src/context/viewer-state'

// eslint-disable-next-line require-jsdoc
function getComponentWithProps(props?: Partial<typeof defaultViewerState>) {
  return mount(
    <ViewerStateContext.Provider
      value={{
        ...defaultViewerState,
        ...props,
      }}>
      <ZoomModeWidget />
    </ViewerStateContext.Provider>,
  )
}
describe('ZoomMode component', () => {
  it('should render without crashing', () => {
    const customWrapper1 = getComponentWithProps({ customZoomLevel: 0, zoomMode: 'custom' })
    expect(customWrapper1).toMatchSnapshot()

    const customWrapper2 = getComponentWithProps({ customZoomLevel: 1, zoomMode: 'custom' })
    expect(customWrapper2).toMatchSnapshot()

    const customWrapper3 = getComponentWithProps({ customZoomLevel: 1, zoomMode: 'fit' })
    expect(customWrapper3).toMatchSnapshot()

    const customWrapper4 = getComponentWithProps({ customZoomLevel: 1, zoomMode: 'fitHeight' })
    expect(customWrapper4).toMatchSnapshot()

    const customWrapper5 = getComponentWithProps({ customZoomLevel: 1, zoomMode: 'fitWidth' })
    expect(customWrapper5).toMatchSnapshot()

    const customWrapper6 = getComponentWithProps({ customZoomLevel: 1, zoomMode: 'originalSize' })
    expect(customWrapper6).toMatchSnapshot()

    const customWrapper7 = getComponentWithProps({ customZoomLevel: 1, zoomMode: 'someOtherValue' } as any)
    expect(customWrapper7).toMatchSnapshot()
  })

  it('should open zoomMenu on icon click', () => {
    const wrapper = getComponentWithProps()
    wrapper.find(IconButton).simulate('click')
    expect(wrapper.find(Menu).prop('open')).toBeTruthy()
  })

  it('should close ZoomMenu and sets the zoomMode to fit when ZoomOutMap clicked', () => {
    const setZoomMode = jest.fn()
    const wrapper = getComponentWithProps({ updateState: setZoomMode })
    wrapper.find(IconButton).simulate('click')
    wrapper
      .find(MenuItem)
      .at(0)
      .simulate('click')
    expect(setZoomMode).toBeCalledWith({ zoomMode: 'fit' })
    expect(wrapper.find(Menu).prop('open')).toBeFalsy()
  })

  it('should close ZoomMenu and sets the zoomMode to originalSize when AspectRatio clicked', () => {
    const setZoomMode = jest.fn()
    const wrapper = getComponentWithProps({ updateState: setZoomMode, zoomMode: 'originalSize' })
    wrapper.find(IconButton).simulate('click')
    wrapper
      .find(MenuItem)
      .at(1)
      .simulate('click')
    expect(setZoomMode).toBeCalledWith({ zoomMode: 'originalSize' })
    expect(wrapper.find(Menu).prop('open')).toBeFalsy()
  })

  it('should close ZoomMenu and sets the zoomMode to fitHeight when reversed "Fit Height" clicked', () => {
    const setZoomMode = jest.fn()
    const wrapper = getComponentWithProps({ updateState: setZoomMode, zoomMode: 'fitHeight' })
    wrapper.find(IconButton).simulate('click')
    wrapper
      .find(MenuItem)
      .at(2)
      .simulate('click')
    expect(setZoomMode).toBeCalledWith({ zoomMode: 'fitHeight' })
    expect(wrapper.find(Menu).prop('open')).toBeFalsy()
  })

  it('should close ZoomMenu and sets the zoomMode to fitWidth when "Fit Width" clicked', () => {
    const setZoomMode = jest.fn()
    const wrapper = getComponentWithProps({ updateState: setZoomMode, zoomMode: 'fitWidth' })
    wrapper.find(IconButton).simulate('click')
    wrapper
      .find(MenuItem)
      .at(3)
      .simulate('click')
    expect(setZoomMode).toBeCalledWith({ zoomMode: 'fitWidth' })
    expect(wrapper.find(Menu).prop('open')).toBeFalsy()
  })

  it('should call setZoomLevel when ZoomIn clicked', async () => {
    const setZoomLevel = jest.fn()
    const wrapper = getComponentWithProps({
      customZoomLevel: 0,
      updateState: setZoomLevel,
      zoomMode: 'custom',
    })
    wrapper.find(IconButton).simulate('click')
    wrapper
      .find(SvgIcon)
      .last()
      .simulate('click')
    expect(setZoomLevel).toBeCalledWith({ customZoomLevel: 1 })
  })

  it('should call setZoomLevel when ZoomOut clicked', async () => {
    const setZoomLevel = jest.fn()
    const wrapper = getComponentWithProps({
      customZoomLevel: 5,
      updateState: setZoomLevel,
      zoomMode: 'custom',
    })

    wrapper.find(IconButton).simulate('click')
    wrapper
      .find(IconButton)
      .find(SvgIcon)
      .at(1)
      .simulate('click')
    expect(setZoomLevel).toBeCalledWith({ customZoomLevel: 6 })
  })
})
