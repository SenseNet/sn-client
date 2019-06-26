import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import SvgIcon from '@material-ui/core/SvgIcon'
import AspectRatio from '@material-ui/icons/AspectRatio'
import Code from '@material-ui/icons/Code'
import ZoomOutMap from '@material-ui/icons/ZoomOutMap'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { ZoomWidgetComponent } from '../src/components/document-widgets/ZoomMode'
import { defaultLocalization } from '../src/store/Localization'

// eslint-disable-next-line require-jsdoc
function getComponentWithProps(props?: Partial<ZoomWidgetComponent['props']>) {
  return shallow(
    <ZoomWidgetComponent
      localization={defaultLocalization}
      customZoomLevel={0}
      setZoomLevel={() => ({} as any)}
      setZoomMode={() => ({} as any)}
      zoomMode="custom"
      {...props}
    />,
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
    wrapper.find(IconButton).simulate('click', { currentTarget: IconButton })
    expect(wrapper.find(Menu).prop('open')).toBeTruthy()
  })

  it('should close ZoomMenu and sets the zoomMode to fit when ZoomOutMap clicked', () => {
    const setZoomMode = jest.fn()
    const wrapper = getComponentWithProps({ setZoomMode })
    wrapper.find(IconButton).simulate('click', { currentTarget: IconButton })
    wrapper
      .find(ZoomOutMap)
      .parent()
      .simulate('click')
    expect(setZoomMode).toBeCalledWith('fit')
    expect(wrapper.find(Menu).prop('open')).toBeFalsy()
  })

  it('should close ZoomMenu and sets the zoomMode to originalSize when AspectRatio clicked', () => {
    const setZoomMode = jest.fn()
    const wrapper = getComponentWithProps({ setZoomMode })
    wrapper.find(IconButton).simulate('click', { currentTarget: IconButton })
    wrapper
      .find(AspectRatio)
      .parent()
      .simulate('click')
    expect(setZoomMode).toBeCalledWith('originalSize')
    expect(wrapper.find(Menu).prop('open')).toBeFalsy()
  })

  it('should close ZoomMenu and sets the zoomMode to fitHeight when reversed "Fit Height" clicked', () => {
    const setZoomMode = jest.fn()
    const wrapper = getComponentWithProps({ setZoomMode })
    wrapper.find(IconButton).simulate('click', { currentTarget: IconButton })
    wrapper
      .find(Code)
      .first()
      .parent()
      .simulate('click')
    expect(setZoomMode).toBeCalledWith('fitHeight')
    expect(wrapper.find(Menu).prop('open')).toBeFalsy()
  })

  it('should close ZoomMenu and sets the zoomMode to fitWidth when "Fit Width" clicked', () => {
    const setZoomMode = jest.fn()
    const wrapper = getComponentWithProps({ setZoomMode })
    wrapper.find(IconButton).simulate('click', { currentTarget: IconButton })
    wrapper
      .find(Code)
      .last()
      .parent()
      .simulate('click')
    expect(setZoomMode).toBeCalledWith('fitWidth')
    expect(wrapper.find(Menu).prop('open')).toBeFalsy()
  })

  it('should call setZoomLevel when ZoomIn clicked', async () => {
    const setZoomLevel = jest.fn()
    const wrapper = mount(
      <ZoomWidgetComponent
        localization={defaultLocalization}
        customZoomLevel={0}
        setZoomLevel={setZoomLevel}
        setZoomMode={jest.fn()}
        zoomMode="custom"
      />,
    )
    wrapper.find(IconButton).simulate('click', { currentTarget: IconButton })
    wrapper
      .find(SvgIcon)
      .last()
      .simulate('click')
    expect(setZoomLevel).toBeCalledWith(1)
  })

  it('should call setZoomLevel when ZoomOut clicked', async () => {
    const setZoomLevel = jest.fn()
    const wrapper = mount(
      <ZoomWidgetComponent
        localization={defaultLocalization}
        customZoomLevel={5}
        setZoomLevel={setZoomLevel}
        setZoomMode={jest.fn()}
        zoomMode="custom"
      />,
    )
    wrapper.find(IconButton).simulate('click', { currentTarget: IconButton })
    wrapper
      .find(IconButton)
      .find(SvgIcon)
      .at(1)
      .simulate('click')
    expect(setZoomLevel).toBeCalledWith(4)
  })
})
