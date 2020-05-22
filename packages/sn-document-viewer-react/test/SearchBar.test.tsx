import React from 'react'
import { shallow } from 'enzyme'
import { SearchBar } from '../src/components/document-widgets/SearchBar'

describe('SearchBar component', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<SearchBar />)
    expect(wrapper).toMatchSnapshot()
  })
})
