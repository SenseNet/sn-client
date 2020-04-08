import { mount } from 'enzyme'
import React from 'react'
import { Button } from '@material-ui/core'
import { DotsMobileStepper } from '../src/components/DotsMobileStepper'

describe('handleNext', () => {
  const mock = {
    imageIndex: 1,
    steppingFunction: jest.fn(),
    imageListLenght: 1,
  }
  it('Handle Next Click', () => {
    const l = mount(<DotsMobileStepper {...mock} />)
    l.find(Button).last().simulate('click')
    expect(mock.steppingFunction).toBeCalledWith(2, false)
  })
  it('Handle Back Click', () => {
    const l = mount(<DotsMobileStepper {...mock} />)
    l.find(Button).first().simulate('click')
    expect(mock.steppingFunction).toBeCalledWith(0, false)
  })
})
