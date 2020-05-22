import React from 'react'
import { shallow } from 'enzyme'
import { Print } from '../src/components/document-widgets/PrintWidget'

describe('Print component', () => {
  it('Should render without crashing', () => {
    const print = jest.fn()
    const wrapper = shallow(<Print print={print} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should trigger a print request when clicked', () => {
    const print = jest.fn()
    const wrapper = shallow(<Print print={print} />)
    wrapper.find('#Print').simulate('click')
    expect(print).toBeCalled()
  })
})
