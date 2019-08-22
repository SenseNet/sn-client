import { shallow } from 'enzyme'
import React from 'react'
import { DocumentViewerLoadingComponent } from '../src/components/DocumentViewerLoading'

describe('Document Viewer Loading component', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<DocumentViewerLoadingComponent loadingDocument="" image="" />)
    expect(wrapper).toMatchSnapshot()
  })
})
