import { shallow } from 'enzyme'
import React from 'react'
import { DownloadComponent } from '../src/components/document-widgets/DownloadWidget'
import { DocumentData } from '../src/models/DocumentData'

describe('DownloadWidget component', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<DownloadComponent download={jest.fn()} title="" document={{} as DocumentData} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should trigger a download request when clicked', () => {
    const download = jest.fn()
    const wrapper = shallow(<DownloadComponent download={download} title="" document={{} as DocumentData} />)
    wrapper.find('#CloudDownload').simulate('click')
    expect(download).toBeCalled()
  })
})
