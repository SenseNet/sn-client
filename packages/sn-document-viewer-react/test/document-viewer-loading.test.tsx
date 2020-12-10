import { shallow } from 'enzyme'
import React from 'react'
import { DocumentViewerLoading } from '../src/components/document-viewer-loading'

describe('Document Viewer Loading component', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<DocumentViewerLoading image={''} />)
    expect(wrapper).toMatchSnapshot()
  })
})
