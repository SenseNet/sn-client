import IconButton from '@material-ui/core/IconButton/IconButton'
import { mount } from 'enzyme'
import React from 'react'
import { defaultViewerState, ViewerStateContext, ZoomInOutWidget } from '../src'

describe('ZoomInOut component', () => {
  it('should render without crashing', () => {
    const wrapper = mount(<ZoomInOutWidget />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should increase zoomLevel in viewerState on zoom in', () => {
    const updateState = jest.fn()
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          zoomLevel: 0,
          updateState,
        }}>
        <ZoomInOutWidget />
      </ViewerStateContext.Provider>,
    )
    wrapper.find(IconButton).first().simulate('click')
    expect(updateState).toBeCalledWith({
      zoomLevel: 1,
    })
  })

  it('should reduce zoomLevel in viewerState on zoom out', () => {
    const updateState = jest.fn()
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          zoomLevel: 1,
          updateState,
        }}>
        <ZoomInOutWidget />
      </ViewerStateContext.Provider>,
    )
    wrapper.find(IconButton).last().simulate('click')
    expect(updateState).toBeCalledWith({
      zoomLevel: 0,
    })
  })
})
