import PictureInPicture from '@material-ui/icons/PictureInPicture'
import { shallow } from 'enzyme'
import React from 'react'
import { ToggleRedactionComponent } from '../src/components/document-widgets/ToggleRedaction'

describe('ToggleRedaction component', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(
      <ToggleRedactionComponent
        toggleRedaction="toggleRedaction"
        showShapes={true}
        canHideRedaction={true}
        setRedaction={jest.fn()}
        showRedaction={true}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('Click on toggle should toggle the redaction', () => {
    const setRedaction = jest.fn()
    const wrapper = shallow(
      <ToggleRedactionComponent
        toggleRedaction="toggleRedaction"
        showShapes={true}
        canHideRedaction={true}
        setRedaction={setRedaction}
        showRedaction={false}
      />,
    )
    wrapper.find(PictureInPicture).simulate('click')
    expect(setRedaction).toBeCalledWith(true)
  })
})
