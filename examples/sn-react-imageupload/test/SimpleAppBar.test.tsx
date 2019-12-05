import { shallow } from 'enzyme'
import React from 'react'
import { SimpleAppBar } from '../src/components/SimpleAppBar'

describe('SimpleAppBar', () => {
  const testprop = {
    uploadsetdata: jest.fn(),
    notificationControll: jest.fn(),
  }
  it('Matches snapshot', () => {
    const wrapper = shallow(<SimpleAppBar {...testprop} />)
    expect(wrapper).toMatchSnapshot()
  })
})
