import IconButton from '@material-ui/core/IconButton/IconButton'
import { mount, shallow } from 'enzyme'
import React from 'react'
import {
  ToggleBase,
  ToggleCommentsWidget,
  ToggleRedactionWidget,
  ToggleShapesWidget,
  ToggleThumbnailsWidget,
  ToggleWatermarkWidget,
} from '../src/components/document-widgets'
import { defaultViewerState, ViewerStateContext } from '../src/context'
import { useViewerState } from '../src/hooks'

describe('Component', () => {
  it('ToggleBase should render without crashing', () => {
    const wrapper = shallow(
      <ToggleBase isVisible={true} title="Test" setValue={jest.fn()}>
        <span>Some children</span>
      </ToggleBase>,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('ToggleRedaction should render without crashing', () => {
    const wrapper = shallow(<ToggleRedactionWidget />)
    expect(wrapper).toMatchSnapshot()
  })

  it('ToggleShapes should render without crashing', () => {
    const wrapper = shallow(<ToggleShapesWidget />)
    expect(wrapper).toMatchSnapshot()
  })

  it('ToggleThumbnails should render without crashing', () => {
    const wrapperWithActiveStyle = mount(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, showThumbnails: true }}>
        <ToggleThumbnailsWidget
          style={{
            fill: 'black',
          }}
          activeColor="pink"
        />
      </ViewerStateContext.Provider>,
    )

    expect(wrapperWithActiveStyle).toMatchSnapshot()
  })

  it('ToggleComments should render without crashing', () => {
    const wrapper = mount(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, showComments: true }}>
        <ToggleCommentsWidget activeColor="pink" />
      </ViewerStateContext.Provider>,
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('ToggleWatermark should render without crashing', () => {
    const wrapper = shallow(<ToggleWatermarkWidget />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Click on toggle should call setValue with the opposite of isVisible', () => {
    const setValue = jest.fn()
    const wrapper = shallow(<ToggleBase isVisible={false} title="Test" setValue={setValue} />)
    wrapper.find(IconButton).simulate('click')
    expect(setValue).toBeCalledWith(true)
  })
})

it('Click on toggle should change the state of showThumbnails in viewer-state provider', () => {
  const updateState = jest.fn()

  const wrapper = mount(
    <ViewerStateContext.Provider
      value={{
        ...defaultViewerState,
        updateState,
      }}>
      <ToggleThumbnailsWidget />
    </ViewerStateContext.Provider>,
  )
  wrapper.find(IconButton).simulate('click')

  expect(updateState).toBeCalledWith({ showThumbnails: true })
})

it('Click on toggle should change the state of showComments in viewer-state provider', () => {
  const updateState = jest.fn()

  const wrapper = mount(
    <ViewerStateContext.Provider
      value={{
        ...defaultViewerState,
        updateState,
      }}>
      <ToggleCommentsWidget />
    </ViewerStateContext.Provider>,
  )
  wrapper.find(IconButton).simulate('click')

  expect(updateState).toBeCalledWith({ showComments: true })
})
