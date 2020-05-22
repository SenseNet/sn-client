import React from 'react'
import { shallow } from 'enzyme'
import { DocumentViewerLoading } from '../src/components/DocumentViewerLoading'

describe('Document Viewer Loading component', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<DocumentViewerLoading image={''} />)
    expect(wrapper).toMatchSnapshot()
  })
})
