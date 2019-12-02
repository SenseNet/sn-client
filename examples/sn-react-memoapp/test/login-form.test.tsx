import { shallow } from 'enzyme'
import React from 'react'
import TextField from '@material-ui/core/TextField'
import { LoginForm } from '../src/components/login-form'

describe('The login instance', () => {
  const testprop = {
    onLogin: jest.fn(),
    error: 'test',
  }

  it('should be rendered correctly', () => {
    expect(shallow(<LoginForm {...testprop} />)).toMatchSnapshot()
  })

  it('should change username state when user changes it', async () => {
    const wrapper = shallow(<LoginForm {...testprop} />)
    ;(wrapper
      .find(TextField)
      .first()
      .prop('onChange') as any)({ target: { value: 'testusername' } } as any)
    expect(
      wrapper
        .update()
        .find(TextField)
        .first()
        .props().value,
    ).toEqual('testusername')
  })

  it('should change repository url state when user changes it', async () => {
    const wrapper = shallow(<LoginForm {...testprop} />)
    ;(wrapper
      .find(TextField)
      .at(2)
      .prop('onChange') as any)({ target: { value: 'https://dev.demo.sensenet.com' } } as any)
    expect(
      wrapper
        .update()
        .find(TextField)
        .at(2)
        .props().value,
    ).toEqual('https://dev.demo.sensenet.com')
  })
})
