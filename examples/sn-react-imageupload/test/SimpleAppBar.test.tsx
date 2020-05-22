import React from 'react'
import { shallow } from 'enzyme'
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
