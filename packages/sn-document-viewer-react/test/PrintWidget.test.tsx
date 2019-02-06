import { shallow } from 'enzyme'
import React from 'react'
import { PrintComponent } from '../src/components/document-widgets/PrintWidget'
import { DocumentData } from '../src/models/DocumentData'

describe('DownloadWidget component', () => {
  it('Should render without crashing', () => {
    const print = jest.fn()
    const wrapper = shallow(<PrintComponent print={print} title="" document={{} as DocumentData} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should trigger a print request when clicked', () => {
    const print = jest.fn()
    const wrapper = shallow(<PrintComponent print={print} title="" document={{} as DocumentData} />)
    wrapper.find('#Print').simulate('click')
    expect(print).toBeCalled()
  })
})
