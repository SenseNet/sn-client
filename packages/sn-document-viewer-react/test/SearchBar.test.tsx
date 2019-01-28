import { shallow } from 'enzyme'
import React from 'react'
import { SearchBarComponent } from '../src/components/document-widgets/SearchBar'

describe('SearchBar component', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<SearchBarComponent placeholder="placeholder" />)
    expect(wrapper).toMatchSnapshot()
  })
})
