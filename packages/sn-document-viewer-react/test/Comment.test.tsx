import CardContent from '@material-ui/core/CardContent'
import { shallow } from 'enzyme'
import React from 'react'
import { Comment } from '../src/components/Comment'

describe('Comment component', () => {
  it('should show text', () => {
    const wrapper = shallow(<Comment commentBody="some text" />)
    expect(wrapper.find(CardContent).exists())
  })
})
