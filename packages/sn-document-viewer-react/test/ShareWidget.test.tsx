import React from 'react'
import { shallow } from 'enzyme'
import { Share } from '../src/components/document-widgets/ShareWidget'

describe('DownloadWidget component', () => {
  it('Should render without crashing', () => {
    const share = jest.fn()
    const wrapper = shallow(<Share share={share} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should trigger a print request when clicked', () => {
    const share = jest.fn()
    const wrapper = shallow(<Share share={share} />)
    wrapper.find('#Share').simulate('click')
    expect(share).toBeCalled()
  })
})
