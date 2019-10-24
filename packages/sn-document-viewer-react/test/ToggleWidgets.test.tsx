import IconButton from '@material-ui/core/IconButton/IconButton'
import { shallow } from 'enzyme'
import React from 'react'
import {
  ToggleBase,
  ToggleRedactionWidget,
  ToggleShapesWidget,
  ToggleThumbnailsWidget,
  ToggleWatermarkWidget,
} from '../src/components/document-widgets'

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
    const wrapper = shallow(<ToggleThumbnailsWidget />)
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
