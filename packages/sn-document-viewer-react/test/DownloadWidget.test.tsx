import { shallow } from 'enzyme'
import React from 'react'
import { Download } from '../src/components/document-widgets/DownloadWidget'

describe('DownloadWidget component', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<Download download={jest.fn()} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should trigger a download request when clicked', () => {
    const download = jest.fn()
    const wrapper = shallow(<Download download={download} />)
    wrapper.find('#CloudDownload').simulate('click')
    expect(download).toBeCalled()
  })
})
