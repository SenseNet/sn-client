import { shallow } from 'enzyme'
import React from 'react'
import { ShareComponent } from '../src/components/document-widgets/ShareWidget'
import { DocumentData } from '../src/models/DocumentData'

describe('DownloadWidget component', () => {
  it('Should render without crashing', () => {
    const share = jest.fn()
    const wrapper = shallow(<ShareComponent share={share} title="" document={{} as DocumentData} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should trigger a print request when clicked', () => {
    const share = jest.fn()
    const wrapper = shallow(<ShareComponent share={share} title="" document={{} as DocumentData} />)
    wrapper.find('#Share').simulate('click')
    expect(share).toBeCalled()
  })
})
